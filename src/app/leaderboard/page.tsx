"use client";

import Link from "next/link";
import { TokenLogo } from "@/components/brand/token-logo";
import { TableSkeleton } from "@/components/ui/skeleton";
import { useActivity, useOverview, useTokens } from "@/hooks/useMarket";
import { useSimulation } from "@/hooks/useSimulation";
import { formatNumber, formatUsd } from "@/lib/format";
import { getMockHolders } from "@/services/mock/catalog";
import { shortAddress } from "@/lib/utils";

export default function LeaderboardPage() {
  const tokens = useTokens({ sort: "marketCap" });
  const trending = useTokens({ sort: "trending" });
  const newest = useTokens({ sort: "newest" });
  const staked = useTokens({ sort: "staked" });
  const activity = useActivity();
  const overview = useOverview();
  const { positions } = useSimulation();
  const topHolders = tokens.data?.[0] ? getMockHolders(tokens.data[0].address) : [];

  if (tokens.isLoading) return <TableSkeleton rows={8} />;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Rankings</p>
        <h1 className="font-display mt-2 text-4xl">Leaderboard</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Rankings are generated from the current indexed catalog. Production rankings must come from actual blockchain data.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Board title="Top stakers" rows={positions.map((position, index) => ({
          rank: index + 1,
          label: shortAddress(position.token),
          value: formatNumber(position.staked),
          href: `/token/${position.token}`,
        }))} />
        <Board title="Largest holders" rows={topHolders.slice(0, 6).map((row) => ({
          rank: row.rank,
          label: shortAddress(row.wallet),
          value: formatUsd(row.valueUsd),
          href: `/wallet/${row.wallet}`,
        }))} />
        <Board title="Most active traders" rows={(activity.data ?? []).slice(0, 6).map((item, index) => ({
          rank: index + 1,
          label: shortAddress(item.wallet),
          value: `${item.type} ${formatNumber(item.amount)} ${item.symbol}`,
          href: `/wallet/${item.wallet}`,
        }))} />
        <Board title="Most staked tokens" rows={(staked.data ?? []).slice(0, 6).map((token, index) => ({
          rank: index + 1,
          label: token.name,
          value: formatUsd(token.stakedAmount * token.priceUsd),
          href: `/token/${token.address}`,
          symbol: token.symbol,
        }))} />
        <Board title="Trending tokens" rows={(trending.data ?? []).slice(0, 6).map((token, index) => ({
          rank: index + 1,
          label: token.name,
          value: formatUsd(token.volume24h),
          href: `/token/${token.address}`,
          symbol: token.symbol,
        }))} />
        <Board title="New tokens" rows={(newest.data ?? []).slice(0, 6).map((token, index) => ({
          rank: index + 1,
          label: token.name,
          value: formatUsd(token.marketCap),
          href: `/token/${token.address}`,
          symbol: token.symbol,
        }))} />
      </div>
      <p className="text-xs text-muted">Catalog size {overview.data?.totalTokens ?? 0}. Rankings refresh with indexed data.</p>
    </div>
  );
}

function Board({
  title,
  rows,
}: {
  title: string;
  rows: { rank: number; label: string; value: string; href: string; symbol?: string }[];
}) {
  return (
    <section className="card p-5">
      <h2 className="font-display text-xl">{title}</h2>
      <div className="mt-4 grid gap-2">
        {rows.map((row) => (
          <Link key={`${title}-${row.rank}-${row.href}`} href={row.href} className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-white/5">
            <span className="w-6 text-muted">#{row.rank}</span>
            {row.symbol ? <TokenLogo symbol={row.symbol} size={28} /> : null}
            <span className="flex-1 truncate">{row.label}</span>
            <span className="text-sm text-muted">{row.value}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
