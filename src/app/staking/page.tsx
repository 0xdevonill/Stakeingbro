"use client";

import Link from "next/link";
import { TokenLogo } from "@/components/brand/token-logo";
import { StakingPanel } from "@/components/staking/staking-panel";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TokenCardSkeleton } from "@/components/ui/skeleton";
import { useOverview, useTokens } from "@/hooks/useMarket";
import { useSimulation } from "@/hooks/useSimulation";
import { formatApr, formatNumber, formatUsd } from "@/lib/format";

export default function StakingPage() {
  const overview = useOverview();
  const tokens = useTokens({ filter: "stakable", sort: "apr" });
  const { positions } = useSimulation();
  const featured = tokens.data?.[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Stake & Earn</p>
        <h1 className="font-display mt-2 text-4xl">Staking</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Rewards depend on the configured staking mechanism and available reward emissions. APR can change with pool parameters.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Box label="Total Value Staked" value={formatUsd(overview.data?.totalValueStaked ?? 0)} />
        <Box label="Total Stakers" value={formatNumber(overview.data?.activeStakers ?? 0)} />
        <Box label="Total Rewards Distributed" value={formatNumber(overview.data?.totalStakingRewards ?? 0)} />
        <Box label="Average Stake" value={formatUsd(((overview.data?.totalValueStaked ?? 0) / Math.max(overview.data?.activeStakers ?? 1, 1)))} />
        <Box label="Your positions" value={String(positions.length)} />
      </div>
      {featured ? <StakingPanel token={featured} /> : <TokenCardSkeleton />}
      <section>
        <h2 className="font-display mb-4 text-2xl">Staking pools</h2>
        {tokens.isLoading ? (
          <div className="grid gap-4 md:grid-cols-3"><TokenCardSkeleton /><TokenCardSkeleton /><TokenCardSkeleton /></div>
        ) : !tokens.data?.length ? (
          <EmptyState title="No staking pools" body="When staking contracts are indexed, available pools will appear here." />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {tokens.data.flatMap((token) =>
              token.pools.map((pool) => (
                <div key={pool.id} className="card p-5">
                  <div className="flex items-center gap-3">
                    <TokenLogo symbol={token.symbol} size={36} />
                    <div>
                      <p className="font-medium">{pool.label}</p>
                      <p className="text-xs text-muted">{token.name}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">APR</p>
                  <p className="font-display text-3xl text-accent">{formatApr(pool.apr)}</p>
                  <p className="mt-2 text-sm text-muted">Lock period {pool.lock === "flexible" ? "None" : `${pool.lock} Days`}</p>
                  <p className="text-sm text-muted">{pool.lock === "flexible" ? "Flexible — Unstake Anytime" : `Unstake after ${pool.lock} days`}</p>
                  <Button asChild className="mt-5 w-full">
                    <Link href={`/token/${token.address}`}>Stake</Link>
                  </Button>
                </div>
              )),
            )}
          </div>
        )}
      </section>
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
