"use client";

import Link from "next/link";
import { use, useState } from "react";
import { Star } from "lucide-react";
import { TokenLogo } from "@/components/brand/token-logo";
import { TokenChart } from "@/components/charts/token-chart";
import { StakingPanel } from "@/components/staking/staking-panel";
import { ActivityFeed, HoldersTable } from "@/components/tokens/activity";
import { SecurityPanel } from "@/components/tokens/security-panel";
import { TradeWidget } from "@/components/trade/trade-widget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartSkeleton, TableSkeleton, TokenCardSkeleton } from "@/components/ui/skeleton";
import { Change } from "@/components/ui/stat";
import { EmptyState } from "@/components/ui/empty-state";
import { explorerAddress, explorerToken } from "@/config/chain";
import { useActivity, useHolders, useToken, useTokenChart } from "@/hooks/useMarket";
import { useWatchlist } from "@/hooks/useWatchlist";
import { formatApr, formatDate, formatNumber, formatUsd } from "@/lib/format";
import { shortAddress } from "@/lib/utils";
import type { ChartRange } from "@/types";

export default function TokenPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const { data: token, isPending, isError } = useToken(address);
  const [range, setRange] = useState<ChartRange>("1D");
  const chart = useTokenChart(address, range);
  const holders = useHolders(address);
  const activity = useActivity(address);
  const watchlist = useWatchlist();

  if (isPending) {
    return (
      <div className="space-y-4">
        <TokenCardSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Token data unavailable"
        body="Indexed market data could not be loaded. Blockchain state remains the source of truth."
      />
    );
  }

  if (!token) {
    return (
      <EmptyState
        title="Token not found"
        body="This contract is not in the current catalog. When an indexer is configured, StakeBro will resolve live Robinhood Chain tokens by address."
      />
    );
  }

  const stakedUsd = token.stakedAmount * token.priceUsd;

  return (
    <div className="space-y-8">
      <section className="card p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <TokenLogo symbol={token.symbol} size={64} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl">{token.name}</h1>
              <span className="text-muted">{token.symbol}</span>
              <Badge tone={token.verified === "verified" ? "accent" : "warning"}>{token.verified}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted">
              {token.network} · launched {formatDate(token.createdAt)} · creator{" "}
              <Link href={`/creator/${token.creator}`} className="text-accent">
                {token.creatorName} ({shortAddress(token.creator)})
              </Link>
            </p>
            <a href={explorerToken(token.address)} className="mt-1 inline-block font-mono text-xs text-muted" target="_blank" rel="noreferrer">
              {token.address}
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="flex-1 sm:flex-none"><a href="#trade">Buy</a></Button>
            <Button asChild variant="danger" className="flex-1 sm:flex-none"><a href="#trade">Sell</a></Button>
            <Button asChild variant="secondary" className="flex-1 sm:flex-none"><a href="#stake">Stake</a></Button>
            <Button variant="outline" onClick={() => watchlist.toggle(token.address)}>
              <Star size={16} className={watchlist.has(token.address) ? "fill-accent text-accent" : ""} />
              {watchlist.has(token.address) ? "Watching" : "Add to Watchlist"}
            </Button>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Price" value={formatUsd(token.priceUsd)} hint={<Change value={token.change24h} />} />
          <Stat label="Market cap" value={formatUsd(token.marketCap)} />
          <Stat label="24H volume" value={formatUsd(token.volume24h)} />
          <Stat label="Liquidity" value={formatUsd(token.liquidityUsd)} />
          <Stat label="Holders" value={formatNumber(token.holders)} />
          <Stat label="Staked" value={`${formatNumber(token.stakedAmount)} · ${token.stakedPercent.toFixed(1)}%`} hint={formatUsd(stakedUsd)} />
          <Stat label="Circulating supply" value={formatNumber(token.circulatingSupply)} />
          <Stat label="Total supply" value={formatNumber(token.totalSupply)} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]" id="trade">
        {chart.isPending ? <ChartSkeleton /> : <TokenChart points={chart.data ?? []} range={range} onRange={setRange} />}
        <TradeWidget token={token} />
      </div>

      <section>
        <h2 className="font-display mb-3 text-2xl">Token statistics</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Stat label="Staking APR" value={token.stakable ? formatApr(token.apr) : "Not stakable"} />
          <Stat label="Buy/sell activity" value="See activity feed" hint="Indexed from public events when available." />
          <Stat label="Staking participation" value={`${token.stakedPercent.toFixed(1)}% of circulating`} />
        </div>
      </section>

      <section id="stake">
        <StakingPanel token={token} />
      </section>

      <section className="card p-5">
        <h2 className="font-display text-2xl">Holders</h2>
        <p className="mt-1 text-sm text-muted">Public balances only. Click a wallet to view on-chain activity.</p>
        <div className="mt-4">{holders.isPending ? <TableSkeleton /> : <HoldersTable rows={holders.data ?? []} symbol={token.symbol} tokenAddress={token.address} />}</div>
      </section>

      <section className="card p-5">
        <h2 className="font-display text-2xl">Activity</h2>
        <div className="mt-4">{activity.isPending ? <TableSkeleton /> : <ActivityFeed items={activity.data ?? []} />}</div>
      </section>

      <section className="card p-5">
        <h2 className="font-display text-2xl">Token analytics</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Stat label="Holder count" value={formatNumber(token.holders)} />
          <Stat label="24h change" value={<Change value={token.change24h} />} />
          <Stat label="Volume / mcap" value={`${((token.volume24h / token.marketCap) * 100).toFixed(2)}%`} />
          <Stat label="Staked value" value={formatUsd(stakedUsd)} />
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-display text-2xl">Creator information</h2>
        <p className="mt-2 text-sm text-muted">{token.creatorName}</p>
        <Link href={`/creator/${token.creator}`} className="mt-1 inline-block font-mono text-accent">
          {token.creator}
        </Link>
        <div className="mt-3 flex gap-3 text-sm">
          {token.social.website ? <a href={token.social.website} className="text-accent" target="_blank" rel="noreferrer">Website</a> : null}
          {token.social.x ? <a href={token.social.x} className="text-accent" target="_blank" rel="noreferrer">X</a> : null}
          {token.social.telegram ? <a href={token.social.telegram} className="text-accent" target="_blank" rel="noreferrer">Telegram</a> : null}
          {token.social.discord ? <a href={token.social.discord} className="text-accent" target="_blank" rel="noreferrer">Discord</a> : null}
        </div>
        <a href={explorerAddress(token.creator)} className="mt-3 inline-block text-xs text-muted" target="_blank" rel="noreferrer">
          View creator on explorer
        </a>
      </section>

      <SecurityPanel token={token} />

      <div className="fixed inset-x-3 bottom-[4.6rem] z-30 grid grid-cols-4 gap-2 lg:hidden">
        <Button asChild size="sm"><a href="#trade">Buy</a></Button>
        <Button asChild size="sm" variant="danger"><a href="#trade">Sell</a></Button>
        <Button asChild size="sm" variant="secondary"><a href="#stake">Stake</a></Button>
        <Button asChild size="sm" variant="outline"><a href="#stake">Claim</a></Button>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <div className="mt-2 font-display text-xl">{value}</div>
      {hint ? <div className="mt-1 text-xs text-muted">{hint}</div> : null}
    </div>
  );
}
