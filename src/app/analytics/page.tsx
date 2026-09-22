"use client";

import { TokenChart } from "@/components/charts/token-chart";
import { TableSkeleton } from "@/components/ui/skeleton";
import { useOverview, useTokenChart, useTokens } from "@/hooks/useMarket";
import { formatNumber, formatUsd } from "@/lib/format";

export default function AnalyticsPage() {
  const overview = useOverview();
  const tokens = useTokens({ sort: "volume" });
  const featured = tokens.data?.[0];
  const chart = useTokenChart(featured?.address ?? "", "1M");

  if (overview.isPending || tokens.isPending) return <TableSkeleton rows={8} />;

  const totalStaked = overview.data?.totalValueStaked ?? 0;
  const stakers = overview.data?.activeStakers ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Insights</p>
        <h1 className="font-display mt-2 text-4xl">Analytics</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Market and staking analytics from the indexed catalog. Charts are labeled when they use development series rather than live chain data.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Box label="Market cap" value={formatUsd(overview.data?.totalMarketCap ?? 0)} />
        <Box label="Liquidity" value={formatUsd((tokens.data ?? []).reduce((sum, token) => sum + token.liquidityUsd, 0))} />
        <Box label="Volume" value={formatUsd(overview.data?.volume24h ?? 0)} />
        <Box label="Holders" value={formatNumber((tokens.data ?? []).reduce((sum, token) => sum + token.holders, 0))} />
        <Box label="Total staked" value={formatUsd(totalStaked)} />
        <Box label="Stakers" value={formatNumber(stakers)} />
      </div>
      {featured && chart.data ? <TokenChart points={chart.data} range="1M" onRange={() => undefined} /> : null}
      <section>
        <h2 className="font-display mb-4 text-2xl">Staking analytics</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Box label="Total value staked" value={formatUsd(totalStaked)} />
          <Box label="Total stakers" value={formatNumber(stakers)} />
          <Box label="Rewards distributed" value={formatNumber(overview.data?.totalStakingRewards ?? 0)} />
          <Box label="Average staking duration" value="Indexed when the staking contract emits duration data" />
        </div>
      </section>
      <section className="card overflow-x-auto p-5">
        <h2 className="font-display text-xl">Token analytics</h2>
        <table className="mt-4 w-full min-w-[720px] text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="py-2">Token</th>
              <th>Price</th>
              <th>Mcap</th>
              <th>Volume</th>
              <th>Holders</th>
              <th>Staked</th>
              <th>APR</th>
            </tr>
          </thead>
          <tbody>
            {(tokens.data ?? []).map((token) => (
              <tr key={token.address} className="border-t border-border">
                <td className="py-3">{token.name}</td>
                <td>{formatUsd(token.priceUsd)}</td>
                <td>{formatUsd(token.marketCap)}</td>
                <td>{formatUsd(token.volume24h)}</td>
                <td>{formatNumber(token.holders)}</td>
                <td>{token.stakedPercent.toFixed(1)}%</td>
                <td>{token.apr.toFixed(2)}%</td>
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
