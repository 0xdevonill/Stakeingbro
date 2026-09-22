"use client";

import { useAccount } from "wagmi";
import { EmptyState } from "@/components/ui/empty-state";
import { env, hasIndexer, hasStakingFactory, hasTokenFactory, isMockMode } from "@/config/env";
import { contracts } from "@/config/contracts";
import { useOverview, useTokens } from "@/hooks/useMarket";
import { formatNumber, formatUsd } from "@/lib/format";
import { shortAddress } from "@/lib/utils";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const allowed = env.adminAddresses;
  const isAdmin = Boolean(address && allowed.includes(address.toLowerCase()));
  const overview = useOverview();
  const tokens = useTokens();

  if (!allowed.length) {
    return (
      <EmptyState
        title="Admin access is not configured"
        body="Set NEXT_PUBLIC_ADMIN_ADDRESSES to the wallet addresses allowed to view this dashboard. StakeBro does not include a hidden admin backdoor."
      />
    );
  }

  if (!isConnected || !isAdmin) {
    return (
      <EmptyState
        title="Admin wallet required"
        body="Connect a wallet that is listed in NEXT_PUBLIC_ADMIN_ADDRESSES. Actions that move funds still require that wallet to sign."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Operations</p>
        <h1 className="font-display mt-2 text-4xl">Admin</h1>
        <p className="mt-2 text-sm text-muted">Signed in as {shortAddress(address!)}. Contract writes still require wallet confirmation.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Box label="Tokens" value={String(tokens.data?.length ?? 0)} />
        <Box label="Creators" value={String(new Set(tokens.data?.map((token) => token.creator)).size)} />
        <Box label="Staking pools" value={String(tokens.data?.reduce((sum, token) => sum + token.pools.length, 0) ?? 0)} />
        <Box label="Volume" value={formatUsd(overview.data?.volume24h ?? 0)} />
      </div>
      <section className="card p-5">
        <h2 className="font-display text-xl">System health</h2>
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <Row label="Data mode" value={isMockMode ? "Development catalog" : "Live indexer"} />
          <Row label="Indexer" value={hasIndexer ? env.indexerUrl : "Not configured"} />
          <Row label="RPC" value={env.rpcUrl} />
          <Row label="Chain ID" value={String(env.chainId)} />
          <Row label="Token factory" value={hasTokenFactory ? env.tokenFactory : "Not configured"} />
          <Row label="Staking factory" value={hasStakingFactory ? env.stakingFactory : "Not configured"} />
          <Row label="Uniswap router" value={contracts.swapRouter} />
          <Row label="Platform fee" value={`${env.platformFeeBps} bps`} />
        </dl>
      </section>
      <section className="card overflow-x-auto p-5">
        <h2 className="font-display text-xl">Tokens</h2>
        <table className="mt-4 w-full min-w-[640px] text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="py-2">Token</th>
              <th>Creator</th>
              <th>Mcap</th>
              <th>Fees</th>
              <th>Pools</th>
            </tr>
          </thead>
          <tbody>
            {(tokens.data ?? []).map((token) => (
              <tr key={token.address} className="border-t border-border">
                <td className="py-3">{token.symbol}</td>
                <td className="font-mono">{shortAddress(token.creator)}</td>
                <td>{formatNumber(token.marketCap)}</td>
                <td>{token.fees.platformFeeBps + token.fees.creatorFeeBps + token.fees.tradingFeeBps} bps</td>
                <td>{token.pools.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-display text-xl">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 break-all">{value}</dd>
    </div>
  );
}
