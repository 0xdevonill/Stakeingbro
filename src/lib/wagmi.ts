"use client";

import { http, createConfig } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { robinhoodChain, robinhoodTestnet } from "@/config/chain";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";

export const wagmiConfig = createConfig({
  chains: [robinhoodChain, robinhoodTestnet],
  connectors: [
    injected(),
    coinbaseWallet({ appName: siteConfig.name }),
  ],
  ssr: true,
  transports: {
    [robinhoodChain.id]: http(
      env.chainId === 4663 ? env.rpcUrl : robinhoodChain.rpcUrls.default.http[0],
    ),
    [robinhoodTestnet.id]: http(
      env.chainId === 46630 ? env.rpcUrl : robinhoodTestnet.rpcUrls.default.http[0],
    ),
  },
});
