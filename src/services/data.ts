import { env, hasIndexer, isMockMode } from "@/config/env";
import type {
  ActivityItem,
  CandlePoint,
  ChartRange,
  CreatorProfile,
  HolderRow,
  MarketOverview,
  QuoteResult,
  TokenRecord,
} from "@/types";
import {
  DEVELOPMENT_CATALOG_NOTICE,
  getMockActivity,
  getMockChart,
  getMockCreator,
  getMockHolders,
  getMockOverview,
  getMockToken,
  mockTokens,
} from "@/services/mock/catalog";

export type TokenQuery = {
  search?: string;
  sort?:
    | "marketCap"
    | "volume"
    | "newest"
    | "trending"
    | "holders"
    | "staked"
    | "apr";
  filter?:
    | "all"
    | "new"
    | "trending"
    | "stakable"
    | "high-liquidity"
    | "low-mcap"
    | "verified"
    | "recent";
};

async function fromIndexer<T>(path: string): Promise<T | null> {
  if (!hasIndexer) return null;
  const response = await fetch(`${env.indexerUrl.replace(/\/$/, "")}${path}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("API_FAILURE");
  return (await response.json()) as T;
}

function applyQuery(tokens: TokenRecord[], query: TokenQuery = {}) {
  let result = [...tokens];
  const search = query.search?.trim().toLowerCase();
  if (search) {
    result = result.filter(
      (token) =>
        token.name.toLowerCase().includes(search) ||
        token.symbol.toLowerCase().includes(search) ||
        token.address.toLowerCase().includes(search) ||
        token.creator.toLowerCase().includes(search),
    );
  }
  switch (query.filter) {
    case "new":
    case "recent":
      result = result.filter((token) => Date.now() - +new Date(token.createdAt) < 7 * 86_400_000);
      break;
    case "trending":
      result = result.filter((token) => token.trending);
      break;
    case "stakable":
      result = result.filter((token) => token.stakable);
      break;
    case "high-liquidity":
      result = result.filter((token) => token.liquidityUsd >= 500_000);
      break;
    case "low-mcap":
      result = result.filter((token) => token.marketCap < 2_000_000);
      break;
    case "verified":
      result = result.filter((token) => token.verified === "verified");
      break;
    default:
      break;
  }
  switch (query.sort) {
    case "volume":
      result.sort((a, b) => b.volume24h - a.volume24h);
      break;
    case "newest":
      result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      break;
    case "trending":
      result.sort((a, b) => Number(b.trending) - Number(a.trending) || b.volume24h - a.volume24h);
      break;
    case "holders":
      result.sort((a, b) => b.holders - a.holders);
      break;
    case "staked":
      result.sort((a, b) => b.stakedAmount * b.priceUsd - a.stakedAmount * a.priceUsd);
      break;
    case "apr":
      result.sort((a, b) => b.apr - a.apr);
      break;
    default:
      result.sort((a, b) => b.marketCap - a.marketCap);
  }
  return result;
}

export const dataSource = {
  mode: isMockMode || !hasIndexer ? ("mock" as const) : ("live" as const),
  notice: isMockMode || !hasIndexer ? DEVELOPMENT_CATALOG_NOTICE : null,
  async listTokens(query: TokenQuery = {}) {
    const live = await fromIndexer<TokenRecord[]>(`/tokens`);
    return applyQuery(live ?? mockTokens, query);
  },
  async getToken(address: string) {
    const live = await fromIndexer<TokenRecord>(`/tokens/${address}`);
    return live ?? getMockToken(address);
  },
  async overview(): Promise<MarketOverview> {
    const live = await fromIndexer<MarketOverview>("/overview");
    return live ?? getMockOverview();
  },
  async chart(address: string, range: ChartRange): Promise<CandlePoint[]> {
    const live = await fromIndexer<CandlePoint[]>(`/tokens/${address}/chart?range=${range}`);
    return live ?? getMockChart(address, range);
  },
  async holders(address: string): Promise<HolderRow[]> {
    const live = await fromIndexer<HolderRow[]>(`/tokens/${address}/holders`);
    return live ?? getMockHolders(address);
  },
  async activity(address?: string): Promise<ActivityItem[]> {
    const path = address ? `/tokens/${address}/activity` : "/activity";
    const live = await fromIndexer<ActivityItem[]>(path);
    return live ?? getMockActivity(address);
  },
  async creator(address: string): Promise<CreatorProfile | undefined> {
    const live = await fromIndexer<CreatorProfile>(`/creators/${address}`);
    return live ?? getMockCreator(address);
  },
  quote(token: TokenRecord, amountIn: number, side: "buy" | "sell"): QuoteResult {
    const reserveQuote = token.liquidityUsd / 2;
    const reserveToken = reserveQuote / token.priceUsd;
    const fee = 1 - (token.fees.tradingFeeBps + token.fees.platformFeeBps) / 10_000;
    if (side === "buy") {
      const amountInUsd = amountIn * 3200;
      const amountOut = (reserveToken * amountInUsd * fee) / (reserveQuote + amountInUsd * fee);
      const spot = amountInUsd / token.priceUsd;
      const priceImpact = spot === 0 ? 0 : ((spot - amountOut) / spot) * 100;
      return {
        amountIn,
        amountOut,
        priceImpact: Math.max(0, priceImpact),
        minimumReceived: amountOut * 0.99,
        networkFeeEth: 0.00021,
        platformFee: amountInUsd * (token.fees.platformFeeBps / 10_000),
        tradingFee: amountInUsd * (token.fees.tradingFeeBps / 10_000),
        slippageBps: 100,
        source: "development-model",
      };
    }
    const amountInUsd = amountIn * token.priceUsd;
    const amountOutUsd = (reserveQuote * amountInUsd * fee) / (reserveToken * token.priceUsd + amountInUsd * fee);
    const amountOutEth = amountOutUsd / 3200;
    const priceImpact = amountInUsd === 0 ? 0 : ((amountInUsd - amountOutUsd) / amountInUsd) * 100;
    return {
      amountIn,
      amountOut: amountOutEth,
      priceImpact: Math.max(0, priceImpact),
      minimumReceived: amountOutEth * 0.99,
      networkFeeEth: 0.00021,
      platformFee: amountInUsd * (token.fees.platformFeeBps / 10_000),
      tradingFee: amountInUsd * (token.fees.tradingFeeBps / 10_000),
      slippageBps: 100,
      source: "development-model",
    };
  },
};
