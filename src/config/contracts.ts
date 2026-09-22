import { env } from "./env";

export const contracts = {
  tokenFactory: env.tokenFactory as `0x${string}` | "",
  stakingFactory: env.stakingFactory as `0x${string}` | "",
  uniswapFactory: env.uniswapFactory as `0x${string}`,
  swapRouter: env.swapRouter as `0x${string}`,
  quoterV2: env.quoterV2 as `0x${string}`,
  universalRouter: env.universalRouter as `0x${string}`,
  permit2: env.permit2 as `0x${string}`,
  weth: env.weth as `0x${string}`,
  usdg: env.usdg as `0x${string}`,
};

export const UNISWAP_FEE_TIER = 3000;
