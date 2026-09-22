import { env } from "@/config/env";
import { hashString, mulberry32 } from "@/lib/utils";
import type {
  ActivityItem,
  CandlePoint,
  ChartRange,
  CreatorProfile,
  HolderRow,
  MarketOverview,
  StakingPosition,
  TokenRecord,
} from "@/types";

function addressFromSeed(seed: string): `0x${string}` {
  const hex = hashString(seed).toString(16).padStart(8, "0");
  const hex2 = hashString(`${seed}:b`).toString(16).padStart(8, "0");
  const hex3 = hashString(`${seed}:c`).toString(16).padStart(8, "0");
  const hex4 = hashString(`${seed}:d`).toString(16).padStart(8, "0");
  const hex5 = hashString(`${seed}:e`).toString(16).padStart(8, "0");
  return `0x${(hex + hex2 + hex3 + hex4 + hex5).slice(0, 40)}`;
}

const now = Date.now();

function daysAgo(days: number, hours = 0) {
  return new Date(now - days * 86_400_000 - hours * 3_600_000).toISOString();
}

const fixtureNote =
  "Development catalog used when no indexer or token factory is configured. These records are not live Robinhood Chain listings.";

const tokens: TokenRecord[] = [
  {
    address: addressFromSeed("aurora"),
    name: "Aurora Finance",
    symbol: "AURA",
    description:
      "Aurora Finance is a development-catalog token used to exercise StakeBro discovery, trading, and staking interfaces.",
    decimals: 18,
    priceUsd: 1.84,
    change24h: 6.42,
    volume24h: 1_240_000,
    liquidityUsd: 2_180_000,
    marketCap: 18_400_000,
    holders: 4120,
    stakedAmount: 3_250_000,
    stakedPercent: 32.5,
    circulatingSupply: 10_000_000,
    totalSupply: 12_000_000,
    apr: 22.4,
    createdAt: daysAgo(18),
    creator: addressFromSeed("creator-aurora"),
    creatorName: "Harbor Labs",
    verified: "verified",
    stakable: true,
    trending: true,
    network: env.chainName,
    fees: { creatorFeeBps: 50, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: {
      mintAuthority: false,
      freezeAuthority: false,
      pausable: false,
      ownerRenounced: true,
    },
    social: { website: "https://stakebro.app/docs", x: "https://x.com/stakebro" },
    pools: [
      { id: "aura-flex", label: "Flexible Staking", lock: "flexible", apr: 12.2, tvl: 980_000, stakers: 640, rewardSymbol: "AURA", emissionPerSecond: 0.018, totalStaked: 1_120_000 },
      { id: "aura-30", label: "30 Day Staking", lock: 30, apr: 20.0, tvl: 1_240_000, stakers: 318, rewardSymbol: "AURA", emissionPerSecond: 0.021, totalStaked: 1_430_000 },
      { id: "aura-90", label: "90 Day Staking", lock: 90, apr: 34.8, tvl: 1_020_000, stakers: 190, rewardSymbol: "AURA", emissionPerSecond: 0.027, totalStaked: 700_000 },
    ],
    tags: ["stakable", "verified", "trending"],
  },
  {
    address: addressFromSeed("harbor"),
    name: "Harbor Protocol",
    symbol: "HRB",
    description: `${fixtureNote} Harbor Protocol represents a higher-liquidity staking token in the catalog.`,
    decimals: 18,
    priceUsd: 0.62,
    change24h: -2.18,
    volume24h: 640_000,
    liquidityUsd: 1_120_000,
    marketCap: 7_440_000,
    holders: 2280,
    stakedAmount: 4_800_000,
    stakedPercent: 40,
    circulatingSupply: 12_000_000,
    totalSupply: 20_000_000,
    apr: 18.6,
    createdAt: daysAgo(42),
    creator: addressFromSeed("creator-harbor"),
    creatorName: "North Pier",
    verified: "verified",
    stakable: true,
    trending: false,
    network: env.chainName,
    fees: { creatorFeeBps: 40, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: false, freezeAuthority: false, pausable: false, ownerRenounced: true },
    social: { telegram: "https://t.me/stakebro" },
    pools: [
      { id: "hrb-flex", label: "Flexible Staking", lock: "flexible", apr: 9.5, tvl: 420_000, stakers: 280, rewardSymbol: "HRB", emissionPerSecond: 0.04, totalStaked: 1_900_000 },
      { id: "hrb-30", label: "30 Day Staking", lock: 30, apr: 18.6, tvl: 860_000, stakers: 210, rewardSymbol: "HRB", emissionPerSecond: 0.05, totalStaked: 2_900_000 },
    ],
    tags: ["stakable", "verified", "high-liquidity"],
  },
  {
    address: addressFromSeed("lumen"),
    name: "Lumen Stake",
    symbol: "LUMEN",
    description: "A recently launched catalog token used to test new-token discovery and launch-date sorting.",
    decimals: 18,
    priceUsd: 0.084,
    change24h: 18.9,
    volume24h: 310_000,
    liquidityUsd: 240_000,
    marketCap: 840_000,
    holders: 640,
    stakedAmount: 1_900_000,
    stakedPercent: 19,
    circulatingSupply: 10_000_000,
    totalSupply: 10_000_000,
    apr: 41.2,
    createdAt: daysAgo(2, 4),
    creator: addressFromSeed("creator-aurora"),
    creatorName: "Harbor Labs",
    verified: "unverified",
    stakable: true,
    trending: true,
    network: env.chainName,
    fees: { creatorFeeBps: 80, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: true, freezeAuthority: false, pausable: true, ownerRenounced: false, owner: addressFromSeed("creator-aurora") },
    social: {},
    pools: [
      { id: "lumen-flex", label: "Flexible Staking", lock: "flexible", apr: 24.0, tvl: 72_000, stakers: 88, rewardSymbol: "LUMEN", emissionPerSecond: 0.12, totalStaked: 900_000 },
      { id: "lumen-90", label: "90 Day Staking", lock: 90, apr: 41.2, tvl: 88_000, stakers: 41, rewardSymbol: "LUMEN", emissionPerSecond: 0.16, totalStaked: 1_000_000 },
    ],
    tags: ["new", "stakable", "low-mcap", "trending"],
  },
  {
    address: addressFromSeed("northwind"),
    name: "Northwind",
    symbol: "NWD",
    description: "Mid-cap catalog token with moderate volume and a verified contract flag in development data.",
    decimals: 18,
    priceUsd: 3.12,
    change24h: 1.05,
    volume24h: 890_000,
    liquidityUsd: 3_400_000,
    marketCap: 31_200_000,
    holders: 8012,
    stakedAmount: 2_100_000,
    stakedPercent: 21,
    circulatingSupply: 10_000_000,
    totalSupply: 10_000_000,
    apr: 14.1,
    createdAt: daysAgo(90),
    creator: addressFromSeed("creator-north"),
    creatorName: "Cedar Workshop",
    verified: "verified",
    stakable: true,
    trending: true,
    network: env.chainName,
    fees: { creatorFeeBps: 25, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: false, freezeAuthority: false, pausable: false, ownerRenounced: true },
    social: { website: "https://stakebro.app", discord: "https://discord.gg/stakebro" },
    pools: [
      { id: "nwd-30", label: "30 Day Staking", lock: 30, apr: 14.1, tvl: 4_200_000, stakers: 920, rewardSymbol: "NWD", emissionPerSecond: 0.008, totalStaked: 2_100_000 },
    ],
    tags: ["verified", "high-liquidity", "trending", "stakable"],
  },
  {
    address: addressFromSeed("quartz"),
    name: "Quartz",
    symbol: "QTZ",
    description: "Low market-cap catalog token with limited liquidity. Used to render risk warnings.",
    decimals: 18,
    priceUsd: 0.012,
    change24h: -8.4,
    volume24h: 42_000,
    liquidityUsd: 38_000,
    marketCap: 180_000,
    holders: 190,
    stakedAmount: 0,
    stakedPercent: 0,
    circulatingSupply: 15_000_000,
    totalSupply: 100_000_000,
    apr: 0,
    createdAt: daysAgo(5),
    creator: addressFromSeed("creator-quartz"),
    creatorName: "Split Rock",
    verified: "unverified",
    stakable: false,
    trending: false,
    network: env.chainName,
    fees: { creatorFeeBps: 100, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: true, freezeAuthority: true, pausable: true, ownerRenounced: false, owner: addressFromSeed("creator-quartz") },
    social: {},
    pools: [],
    tags: ["new", "low-mcap", "unverified"],
  },
  {
    address: addressFromSeed("ridge"),
    name: "Ridge",
    symbol: "RIDGE",
    description: "Catalog token with a large staking ratio, used for highest-staked sorting.",
    decimals: 18,
    priceUsd: 0.44,
    change24h: 3.3,
    volume24h: 210_000,
    liquidityUsd: 620_000,
    marketCap: 4_400_000,
    holders: 1540,
    stakedAmount: 6_400_000,
    stakedPercent: 64,
    circulatingSupply: 10_000_000,
    totalSupply: 10_000_000,
    apr: 28.0,
    createdAt: daysAgo(21),
    creator: addressFromSeed("creator-harbor"),
    creatorName: "North Pier",
    verified: "verified",
    stakable: true,
    trending: false,
    network: env.chainName,
    fees: { creatorFeeBps: 50, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: false, freezeAuthority: false, pausable: false, ownerRenounced: true },
    social: { x: "https://x.com/stakebro" },
    pools: [
      { id: "ridge-flex", label: "Flexible Staking", lock: "flexible", apr: 16.4, tvl: 510_000, stakers: 330, rewardSymbol: "RIDGE", emissionPerSecond: 0.03, totalStaked: 2_200_000 },
      { id: "ridge-90", label: "90 Day Staking", lock: 90, apr: 28.0, tvl: 1_980_000, stakers: 410, rewardSymbol: "RIDGE", emissionPerSecond: 0.045, totalStaked: 4_200_000 },
    ],
    tags: ["stakable", "verified"],
  },
  {
    address: addressFromSeed("solace"),
    name: "Solace",
    symbol: "SLC",
    description: "Steady catalog token used for holder-growth and analytics charts.",
    decimals: 18,
    priceUsd: 0.91,
    change24h: 0.42,
    volume24h: 155_000,
    liquidityUsd: 780_000,
    marketCap: 5_460_000,
    holders: 3011,
    stakedAmount: 1_100_000,
    stakedPercent: 18.3,
    circulatingSupply: 6_000_000,
    totalSupply: 8_000_000,
    apr: 11.8,
    createdAt: daysAgo(60),
    creator: addressFromSeed("creator-north"),
    creatorName: "Cedar Workshop",
    verified: "verified",
    stakable: true,
    trending: false,
    network: env.chainName,
    fees: { creatorFeeBps: 30, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: false, freezeAuthority: false, pausable: false, ownerRenounced: true },
    social: {},
    pools: [
      { id: "slc-flex", label: "Flexible Staking", lock: "flexible", apr: 11.8, tvl: 990_000, stakers: 270, rewardSymbol: "SLC", emissionPerSecond: 0.011, totalStaked: 1_100_000 },
    ],
    tags: ["stakable", "verified"],
  },
  {
    address: addressFromSeed("tidal"),
    name: "Tidal",
    symbol: "TDL",
    description: "High-volume catalog token used for trending and most-active trader views.",
    decimals: 18,
    priceUsd: 2.47,
    change24h: 9.15,
    volume24h: 2_880_000,
    liquidityUsd: 4_100_000,
    marketCap: 24_700_000,
    holders: 6230,
    stakedAmount: 1_800_000,
    stakedPercent: 18,
    circulatingSupply: 10_000_000,
    totalSupply: 10_000_000,
    apr: 16.2,
    createdAt: daysAgo(14),
    creator: addressFromSeed("creator-tidal"),
    creatorName: "Blue Current",
    verified: "verified",
    stakable: true,
    trending: true,
    network: env.chainName,
    fees: { creatorFeeBps: 35, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: false, freezeAuthority: false, pausable: false, ownerRenounced: true },
    social: { website: "https://stakebro.app/explore" },
    pools: [
      { id: "tdl-30", label: "30 Day Staking", lock: 30, apr: 16.2, tvl: 3_400_000, stakers: 540, rewardSymbol: "TDL", emissionPerSecond: 0.009, totalStaked: 1_800_000 },
    ],
    tags: ["trending", "verified", "high-liquidity", "stakable"],
  },
  {
    address: addressFromSeed("ember"),
    name: "Ember",
    symbol: "EMB",
    description: "Recently launched catalog token with staking enabled.",
    decimals: 18,
    priceUsd: 0.21,
    change24h: 12.6,
    volume24h: 188_000,
    liquidityUsd: 210_000,
    marketCap: 1_260_000,
    holders: 870,
    stakedAmount: 980_000,
    stakedPercent: 16.3,
    circulatingSupply: 6_000_000,
    totalSupply: 12_000_000,
    apr: 31.5,
    createdAt: daysAgo(1, 6),
    creator: addressFromSeed("creator-tidal"),
    creatorName: "Blue Current",
    verified: "unknown",
    stakable: true,
    trending: true,
    network: env.chainName,
    fees: { creatorFeeBps: 60, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: false, freezeAuthority: false, pausable: false, ownerRenounced: false, owner: addressFromSeed("creator-tidal") },
    social: {},
    pools: [
      { id: "emb-flex", label: "Flexible Staking", lock: "flexible", apr: 19.0, tvl: 80_000, stakers: 62, rewardSymbol: "EMB", emissionPerSecond: 0.07, totalStaked: 380_000 },
      { id: "emb-30", label: "30 Day Staking", lock: 30, apr: 31.5, tvl: 126_000, stakers: 49, rewardSymbol: "EMB", emissionPerSecond: 0.09, totalStaked: 600_000 },
    ],
    tags: ["new", "recent", "stakable", "trending", "low-mcap"],
  },
  {
    address: addressFromSeed("cascade"),
    name: "Cascade",
    symbol: "CSC",
    description: "Catalog token with a long launch history for creator-profile pages.",
    decimals: 18,
    priceUsd: 1.05,
    change24h: -0.8,
    volume24h: 96_000,
    liquidityUsd: 510_000,
    marketCap: 8_400_000,
    holders: 1980,
    stakedAmount: 2_200_000,
    stakedPercent: 27.5,
    circulatingSupply: 8_000_000,
    totalSupply: 8_000_000,
    apr: 15.4,
    createdAt: daysAgo(110),
    creator: addressFromSeed("creator-aurora"),
    creatorName: "Harbor Labs",
    verified: "verified",
    stakable: true,
    trending: false,
    network: env.chainName,
    fees: { creatorFeeBps: 20, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: false, freezeAuthority: false, pausable: false, ownerRenounced: true },
    social: {},
    pools: [
      { id: "csc-90", label: "90 Day Staking", lock: 90, apr: 15.4, tvl: 2_100_000, stakers: 300, rewardSymbol: "CSC", emissionPerSecond: 0.01, totalStaked: 2_200_000 },
    ],
    tags: ["stakable", "verified"],
  },
  {
    address: addressFromSeed("vertex"),
    name: "Vertex",
    symbol: "VTX",
    description: "Catalog token used for leaderboard and analytics density.",
    decimals: 18,
    priceUsd: 5.6,
    change24h: 4.1,
    volume24h: 1_020_000,
    liquidityUsd: 6_800_000,
    marketCap: 56_000_000,
    holders: 11240,
    stakedAmount: 1_400_000,
    stakedPercent: 14,
    circulatingSupply: 10_000_000,
    totalSupply: 10_000_000,
    apr: 8.4,
    createdAt: daysAgo(200),
    creator: addressFromSeed("creator-vertex"),
    creatorName: "Peakline",
    verified: "verified",
    stakable: true,
    trending: true,
    network: env.chainName,
    fees: { creatorFeeBps: 15, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: false, freezeAuthority: false, pausable: false, ownerRenounced: true },
    social: { website: "https://stakebro.app/analytics" },
    pools: [
      { id: "vtx-flex", label: "Flexible Staking", lock: "flexible", apr: 8.4, tvl: 7_800_000, stakers: 1480, rewardSymbol: "VTX", emissionPerSecond: 0.003, totalStaked: 1_400_000 },
    ],
    tags: ["verified", "high-liquidity", "trending", "stakable"],
  },
  {
    address: addressFromSeed("driftwood"),
    name: "Driftwood",
    symbol: "DRFT",
    description: "Smaller catalog token with flexible-only staking.",
    decimals: 18,
    priceUsd: 0.033,
    change24h: 2.2,
    volume24h: 27_000,
    liquidityUsd: 94_000,
    marketCap: 330_000,
    holders: 410,
    stakedAmount: 2_400_000,
    stakedPercent: 24,
    circulatingSupply: 10_000_000,
    totalSupply: 25_000_000,
    apr: 26.0,
    createdAt: daysAgo(8),
    creator: addressFromSeed("creator-quartz"),
    creatorName: "Split Rock",
    verified: "unverified",
    stakable: true,
    trending: false,
    network: env.chainName,
    fees: { creatorFeeBps: 70, platformFeeBps: env.platformFeeBps, tradingFeeBps: 30 },
    permissions: { mintAuthority: false, freezeAuthority: true, pausable: false, ownerRenounced: false, owner: addressFromSeed("creator-quartz") },
    social: {},
    pools: [
      { id: "drft-flex", label: "Flexible Staking", lock: "flexible", apr: 26.0, tvl: 79_000, stakers: 54, rewardSymbol: "DRFT", emissionPerSecond: 0.08, totalStaked: 2_400_000 },
    ],
    tags: ["stakable", "low-mcap", "recent"],
  },
];

export const mockTokens = tokens;

export function getMockToken(address: string) {
  return tokens.find((token) => token.address.toLowerCase() === address.toLowerCase());
}

export function getMockOverview(): MarketOverview {
  return {
    totalMarketCap: tokens.reduce((sum, token) => sum + token.marketCap, 0),
    volume24h: tokens.reduce((sum, token) => sum + token.volume24h, 0),
    totalTokens: tokens.length,
    totalValueStaked: tokens.reduce((sum, token) => sum + token.stakedAmount * token.priceUsd, 0),
    totalStakingRewards: 842_330,
    activeStakers: tokens.reduce((sum, token) => sum + token.pools.reduce((p, pool) => p + pool.stakers, 0), 0),
  };
}

export function getMockChart(address: string, range: ChartRange): CandlePoint[] {
  const token = getMockToken(address);
  if (!token) return [];
  const steps: Record<ChartRange, { count: number; interval: number }> = {
    "1H": { count: 60, interval: 60_000 },
    "4H": { count: 48, interval: 5 * 60_000 },
    "1D": { count: 48, interval: 30 * 60_000 },
    "1W": { count: 56, interval: 3 * 60 * 60_000 },
    "1M": { count: 30, interval: 24 * 60 * 60_000 },
    "1Y": { count: 52, interval: 7 * 24 * 60 * 60_000 },
    ALL: { count: 64, interval: 14 * 24 * 60 * 60_000 },
  };
  const { count, interval } = steps[range];
  const rand = mulberry32(hashString(`${address}:${range}`));
  let price = token.priceUsd * 0.82;
  const points: CandlePoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const drift = (token.priceUsd - price) / (count - i);
    const noise = (rand() - 0.48) * token.priceUsd * 0.04;
    const open = price;
    const close = Math.max(token.priceUsd * 0.2, open + drift + noise);
    const high = Math.max(open, close) * (1 + rand() * 0.012);
    const low = Math.min(open, close) * (1 - rand() * 0.012);
    const volume = token.volume24h * (0.01 + rand() * 0.04);
    price = close;
    points.push({
      time: now - (count - i) * interval,
      open,
      high,
      low,
      close,
      volume,
      marketCap: close * token.circulatingSupply,
      buys: Math.round(40 + rand() * 80),
      sells: Math.round(30 + rand() * 70),
    });
  }
  points[points.length - 1].close = token.priceUsd;
  return points;
}

export function getMockHolders(address: string): HolderRow[] {
  const token = getMockToken(address);
  if (!token) return [];
  const rand = mulberry32(hashString(`holders:${address}`));
  const rows: HolderRow[] = [];
  let remaining = 0.42;
  for (let i = 0; i < 12; i += 1) {
    const percent = i === 0 ? 8.4 : remaining * (0.18 + rand() * 0.2);
    remaining -= percent / 100;
    const balance = (percent / 100) * token.circulatingSupply;
    rows.push({
      rank: i + 1,
      wallet: addressFromSeed(`holder:${address}:${i}`),
      balance,
      percent,
      valueUsd: balance * token.priceUsd,
      staked: balance * (0.1 + rand() * 0.5),
      lastActivity: daysAgo(rand() * 12, rand() * 20),
    });
  }
  return rows;
}

export function getMockActivity(address?: string): ActivityItem[] {
  const source = address ? tokens.filter((token) => token.address === address) : tokens;
  const types: ActivityItem["type"][] = ["buy", "sell", "stake", "unstake", "claim", "compound", "holder"];
  const rand = mulberry32(hashString(`activity:${address ?? "all"}`));
  return Array.from({ length: 18 }, (_, index) => {
    const token = source[Math.floor(rand() * source.length)];
    const type = types[Math.floor(rand() * types.length)];
    const amount = Math.round((50 + rand() * 80_000) * 100) / 100;
    return {
      id: `act-${index}-${token.address}`,
      type,
      wallet: addressFromSeed(`wallet:${index}:${token.symbol}`),
      token: token.address,
      symbol: token.symbol,
      amount,
      usdValue: amount * token.priceUsd,
      timestamp: daysAgo(0, rand() * 48),
      status: "confirmed" as const,
    };
  }).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
}

export function getMockCreator(address: string): CreatorProfile | undefined {
  const launches = tokens.filter((token) => token.creator.toLowerCase() === address.toLowerCase());
  if (!launches.length) return undefined;
  return {
    address: launches[0].creator,
    name: launches[0].creatorName,
    tokensLaunched: launches.length,
    totalHolders: launches.reduce((sum, token) => sum + token.holders, 0),
    totalLiquidity: launches.reduce((sum, token) => sum + token.liquidityUsd, 0),
    totalVolume: launches.reduce((sum, token) => sum + token.volume24h, 0),
    social: launches[0].social,
    launches,
  };
}

export function getMockPositions(): StakingPosition[] {
  const aura = tokens[0];
  const ridge = tokens[5];
  return [
    {
      token: aura.address,
      poolId: aura.pools[1].id,
      staked: 125_000,
      pendingRewards: 342.72,
      earned: 2438.2,
      apr: aura.pools[1].apr,
      dailyReward: 68.49,
      lock: 30,
      unlockAt: new Date(now + 11 * 86_400_000).toISOString(),
      rewardRatePerSecond: 0.0021,
    },
    {
      token: ridge.address,
      poolId: ridge.pools[0].id,
      staked: 40_000,
      pendingRewards: 88.4,
      earned: 610.1,
      apr: ridge.pools[0].apr,
      dailyReward: 18.0,
      lock: "flexible",
      rewardRatePerSecond: 0.0008,
    },
  ];
}

export const mockAddress = addressFromSeed;
export const DEVELOPMENT_CATALOG_NOTICE =
  "Development catalog — not live Robinhood Chain market data. Configure an indexer and contracts to load on-chain listings.";
