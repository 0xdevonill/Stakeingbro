export type DataMode = "mock" | "live";

export type VerificationStatus = "verified" | "unverified" | "unknown";

export type TokenRiskFlag =
  | "mint_authority"
  | "freeze_authority"
  | "pausable"
  | "low_liquidity"
  | "unverified"
  | "owner_present";

export type StakingLock = "flexible" | 30 | 90;

export interface SocialLinks {
  website?: string;
  x?: string;
  telegram?: string;
  discord?: string;
}

export interface TokenFees {
  creatorFeeBps: number;
  platformFeeBps: number;
  tradingFeeBps: number;
}

export interface TokenPermissions {
  mintAuthority: boolean;
  freezeAuthority: boolean;
  pausable: boolean;
  ownerRenounced: boolean;
  owner?: string;
}

export interface StakingPool {
  id: string;
  label: string;
  lock: StakingLock;
  apr: number;
  tvl: number;
  stakers: number;
  rewardSymbol: string;
  emissionPerSecond: number;
  totalStaked: number;
}

export interface TokenRecord {
  address: `0x${string}`;
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  priceUsd: number;
  change24h: number;
  volume24h: number;
  liquidityUsd: number;
  marketCap: number;
  holders: number;
  stakedAmount: number;
  stakedPercent: number;
  circulatingSupply: number;
  totalSupply: number;
  apr: number;
  createdAt: string;
  creator: `0x${string}`;
  creatorName: string;
  verified: VerificationStatus;
  stakable: boolean;
  trending: boolean;
  network: string;
  fees: TokenFees;
  permissions: TokenPermissions;
  social: SocialLinks;
  pools: StakingPool[];
  tags: string[];
}

export interface MarketOverview {
  totalMarketCap: number;
  volume24h: number;
  totalTokens: number;
  totalValueStaked: number;
  totalStakingRewards: number;
  activeStakers: number;
}

export interface CandlePoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  marketCap: number;
  buys: number;
  sells: number;
}

export type ActivityType =
  | "buy"
  | "sell"
  | "stake"
  | "unstake"
  | "claim"
  | "compound"
  | "create"
  | "liquidity"
  | "holder";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  wallet: `0x${string}`;
  token: `0x${string}`;
  symbol: string;
  amount: number;
  usdValue: number;
  hash?: string;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
}

export interface HolderRow {
  rank: number;
  wallet: `0x${string}`;
  balance: number;
  percent: number;
  valueUsd: number;
  staked: number;
  lastActivity: string;
}

export interface CreatorProfile {
  address: `0x${string}`;
  name: string;
  tokensLaunched: number;
  totalHolders: number;
  totalLiquidity: number;
  totalVolume: number;
  social: SocialLinks;
  launches: TokenRecord[];
}

export interface StakingPosition {
  token: `0x${string}`;
  poolId: string;
  staked: number;
  pendingRewards: number;
  earned: number;
  apr: number;
  dailyReward: number;
  lock: StakingLock;
  unlockAt?: string;
  rewardRatePerSecond: number;
}

export interface PortfolioHolding {
  token: TokenRecord;
  balance: number;
  staked: number;
  pendingRewards: number;
  valueUsd: number;
}

export interface QuoteResult {
  amountIn: number;
  amountOut: number;
  priceImpact: number;
  minimumReceived: number;
  networkFeeEth: number;
  platformFee: number;
  tradingFee: number;
  slippageBps: number;
  source: "uniswap" | "development-model";
}

export interface LeaderboardEntry {
  rank: number;
  label: string;
  sublabel: string;
  address?: `0x${string}`;
  token?: TokenRecord;
  value: number;
  valueLabel: string;
}

export type ChartRange = "1H" | "4H" | "1D" | "1W" | "1M" | "1Y" | "ALL";
