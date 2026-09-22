"use client";

import Link from "next/link";
import { use } from "react";
import { TokenCard } from "@/components/tokens/token-card";
import { EmptyState } from "@/components/ui/empty-state";
import { explorerAddress } from "@/config/chain";
import { useCreator } from "@/hooks/useMarket";
import { formatNumber, formatUsd } from "@/lib/format";

export default function CreatorPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const { data, isLoading } = useCreator(address);

  if (isLoading) return <p className="text-muted">Loading creator…</p>;
  if (!data) {
    return (
      <EmptyState
        title="Creator not found"
        body="This wallet has no indexed token launches in the current catalog."
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Creator</p>
        <h1 className="font-display mt-2 text-4xl">{data.name}</h1>
        <a href={explorerAddress(data.address)} className="mt-2 inline-block font-mono text-sm text-accent" target="_blank" rel="noreferrer">
          {data.address}
        </a>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Box label="Tokens launched" value={String(data.tokensLaunched)} />
          <Box label="Total token holders" value={formatNumber(data.totalHolders)} />
          <Box label="Total liquidity created" value={formatUsd(data.totalLiquidity)} />
          <Box label="Total volume" value={formatUsd(data.totalVolume)} />
        </div>
      </section>
      <section>
        <h2 className="font-display mb-4 text-2xl">Launch history</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {data.launches.map((token) => (
            <TokenCard key={token.address} token={token} />
          ))}
        </div>
      </section>
      <Link href="/explore" className="text-sm text-accent">
        Back to explore
      </Link>
    </div>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-display text-xl">{value}</p>
    </div>
  );
}
