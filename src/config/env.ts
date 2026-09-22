function read(name: string, fallback = "") {
  return (process.env[name] ?? fallback).trim();
}

function readNumber(name: string, fallback: number) {
  const value = Number(read(name));
  return Number.isFinite(value) && value !== 0 ? value : fallback;
}

export const env = {
  dataMode: (read("NEXT_PUBLIC_DATA_MODE", "mock") === "live" ? "live" : "mock") as
    | "live"
    | "mock",
  chainId: readNumber("NEXT_PUBLIC_CHAIN_ID", 4663),
  chainName: read("NEXT_PUBLIC_CHAIN_NAME", "Robinhood Chain"),
  rpcUrl: read("NEXT_PUBLIC_RPC_URL", "https://rpc.mainnet.chain.robinhood.com"),
  explorerUrl: read("NEXT_PUBLIC_EXPLORER_URL", "https://robinhoodchain.blockscout.com"),
  nativeSymbol: read("NEXT_PUBLIC_NATIVE_SYMBOL", "ETH"),
  nativeName: read("NEXT_PUBLIC_NATIVE_NAME", "Ether"),
  tokenFactory: read("NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS"),
  stakingFactory: read("NEXT_PUBLIC_STAKING_FACTORY_ADDRESS"),
  platformTreasury: read("NEXT_PUBLIC_PLATFORM_TREASURY_ADDRESS"),
  uniswapFactory: read(
    "NEXT_PUBLIC_UNISWAP_V3_FACTORY",
    "0x1f7d7550B1b028f7571E69A784071F0205FD2EfA",
  ),
  swapRouter: read(
    "NEXT_PUBLIC_UNISWAP_SWAP_ROUTER",
    "0xCaf681a66D020601342297493863E78C959E5cb2",
  ),
  quoterV2: read(
    "NEXT_PUBLIC_UNISWAP_QUOTER_V2",
    "0x33e885eD0Ec9bF04EcfB19341582aADCb4c8A9E7",
  ),
  universalRouter: read(
    "NEXT_PUBLIC_UNISWAP_UNIVERSAL_ROUTER",
    "0x8876789976dEcBfCbBbe364623C63652db8C0904",
  ),
  permit2: read("NEXT_PUBLIC_PERMIT2", "0x000000000022D473030F116dDEE9F6B43aC78BA3"),
  weth: read("NEXT_PUBLIC_WETH_ADDRESS", "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73"),
  usdg: read("NEXT_PUBLIC_USDG_ADDRESS", "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168"),
  platformFeeBps: readNumber("NEXT_PUBLIC_PLATFORM_FEE_BPS", 30),
  defaultCreatorFeeBps: readNumber("NEXT_PUBLIC_DEFAULT_CREATOR_FEE_BPS", 50),
  defaultTradingFeeBps: readNumber("NEXT_PUBLIC_DEFAULT_TRADING_FEE_BPS", 30),
  indexerUrl: read("NEXT_PUBLIC_INDEXER_URL"),
  walletConnectProjectId: read("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"),
  adminAddresses: read("NEXT_PUBLIC_ADMIN_ADDRESSES")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean),
};

export const isMockMode = env.dataMode === "mock";
export const hasTokenFactory = Boolean(env.tokenFactory);
export const hasStakingFactory = Boolean(env.stakingFactory);
export const hasIndexer = Boolean(env.indexerUrl);
