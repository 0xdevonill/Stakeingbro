import { defineChain } from "viem";
import { env } from "./env";

export const robinhoodChain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.mainnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://robinhoodchain.blockscout.com" },
  },
});

export const robinhoodTestnet = defineChain({
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://explorer.testnet.chain.robinhood.com" },
  },
});

export const configuredChain = env.chainId === 46630 ? robinhoodTestnet : robinhoodChain;

export const supportedChains = [robinhoodChain, robinhoodTestnet] as const;

export function explorerAddress(address: string) {
  return `${env.explorerUrl.replace(/\/$/, "")}/address/${address}`;
}

export function explorerTx(hash: string) {
  return `${env.explorerUrl.replace(/\/$/, "")}/tx/${hash}`;
}

export function explorerToken(address: string) {
  return `${env.explorerUrl.replace(/\/$/, "")}/token/${address}`;
}
