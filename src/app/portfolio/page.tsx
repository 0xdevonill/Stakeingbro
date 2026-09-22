"use client";

import Link from "next/link";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import { TokenLogo } from "@/components/brand/token-logo";
import { ActivityFeed } from "@/components/tokens/activity";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { env } from "@/config/env";
import { useTokens } from "@/hooks/useMarket";
import { useSimulation } from "@/hooks/useSimulation";
import { useWatchlist } from "@/hooks/useWatchlist";
import { formatNumber, formatUsd } from "@/lib/format";

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const eth = useBalance({ address });
  const { data: tokens } = useTokens();
  const { positions, txs, holdings } = useSimulation();
  const watchlist = useWatchlist();

  if (!isConnected) {
    return (
      <EmptyState
        title="Connect a wallet"
        body="My Portfolio shows public balances, staking positions, pending rewards, and recent transactions for the connected address. StakeBro never asks for a seed phrase."
      />
    );
  }

  const holdingRows = (tokens ?? [])
    .map((token) => ({
      token,
      balance: holdings[token.address] ?? 0,
      position: positions.find((item) => item.token === token.address),
    }))
    .filter((row) => row.balance > 0 || row.position);

  const stakedValue = holdingRows.reduce((sum, row) => sum + (row.position?.staked ?? 0) * row.token.priceUsd, 0);
  const tokenValue = holdingRows.reduce((sum, row) => sum + row.balance * row.token.priceUsd, 0);
  const pending = holdingRows.reduce((sum, row) => sum + (row.position?.pendingRewards ?? 0), 0);
  const earned = holdingRows.reduce((sum, row) => sum + (row.position?.earned ?? 0), 0);
  const ethValue = Number(eth.data ? formatEther(eth.data.value) : 0) * 3200;
  const total = tokenValue + stakedValue + ethValue;
  const watched = (tokens ?? []).filter((token) => watchlist.has(token.address));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">My Portfolio</p>
        <h1 className="font-display mt-2 text-4xl">Portfolio</h1>
        <p className="mt-2 font-mono text-sm text-muted">{address}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Box label="Portfolio value" value={formatUsd(total)} />
        <Box label="Staked value" value={formatUsd(stakedValue)} />
        <Box label="Pending rewards" value={formatNumber(pending)} />
        <Box label="Total rewards earned" value={formatNumber(earned)} />
      </div>
      <p className="text-xs text-warning">
        Token holdings and staking figures in development mode include local simulation state and are not a live on-chain portfolio. ETH balance is read from the connected wallet when available.
      </p>
      <section className="card p-5">
        <h2 className="font-display text-xl">Token holdings</h2>
        {holdingRows.length ? (
          <div className="mt-4 grid gap-2">
            {holdingRows.map((row) => (
              <Link key={row.token.address} href={`/token/${row.token.address}`} className="flex items-center gap-3 rounded-2xl px-2 py-3 hover:bg-white/5">
                <TokenLogo symbol={row.token.symbol} size={32} />
                <div className="flex-1">
                  <p>{row.token.name}</p>
                  <p className="text-xs text-muted">
                    {formatNumber(row.balance)} available · {formatNumber(row.position?.staked ?? 0)} staked
                  </p>
                </div>
                <p>{formatUsd((row.balance + (row.position?.staked ?? 0)) * row.token.priceUsd)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-4 border-0 bg-transparent p-0 shadow-none"
            title="No staking position"
            body="You are not currently staking this token. Start earning rewards by staking your tokens."
            action={{ label: "Stake Token", onClick: () => undefined }}
          />
        )}
      </section>
      <section className="card p-5">
        <h2 className="font-display text-xl">Watchlist</h2>
        <div className="mt-4 grid gap-2">
          {watched.map((token) => (
            <Link key={token.address} href={`/token/${token.address}`} className="flex items-center justify-between rounded-2xl px-2 py-2 hover:bg-white/5">
              <span>{token.name}</span>
              <span className="text-sm text-muted">{formatUsd(token.priceUsd)}</span>
            </Link>
          ))}
          {!watched.length ? <p className="text-sm text-muted">No watched tokens yet.</p> : null}
        </div>
      </section>
      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Recent transactions</h2>
          <Button asChild variant="ghost" size="sm"><Link href="/docs">Statuses</Link></Button>
        </div>
        <div className="mt-4">
          <ActivityFeed items={txs} />
          {!txs.length ? <p className="text-sm text-muted">No local transactions yet. Wallet-confirmed chain transactions will appear when indexing is connected.</p> : null}
        </div>
      </section>
      <p className="text-xs text-muted">Native wallet balance: {eth.data ? `${formatEther(eth.data.value)} ${env.nativeSymbol}` : "waiting for RPC"}.</p>
    </div>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  );
}
