"use client";

import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { robinhoodChain, robinhoodTestnet } from "@/config/chain";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";

const connectors = [
  injected({ shimDisconnect: true }),
  coinbaseWallet({ appName: siteConfig.name }),
];

if (env.walletConnectProjectId) {
  connectors.push(
    walletConnect({
      projectId: env.walletConnectProjectId,
      showQrModal: true,
    }),
  );
}

export const wagmiConfig = createConfig({
  chains: [robinhoodChain, robinhoodTestnet],
  connectors,
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [robinhoodChain.id]: http(env.chainId === 4663 ? env.rpcUrl : robinhoodChain.rpcUrls.default.http[0]),
    [robinhoodTestnet.id]: http(env.chainId === 46630 ? env.rpcUrl : robinhoodTestnet.rpcUrls.default.http[0]),
  },
});
