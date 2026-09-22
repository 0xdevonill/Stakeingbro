"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { ActivityFeed } from "@/components/tokens/activity";
import { explorerAddress } from "@/config/chain";
import { useActivity, useTokens } from "@/hooks/useMarket";
import { formatNumber } from "@/lib/format";
import { getMockHolders } from "@/services/mock/catalog";
import { shortAddress } from "@/lib/utils";

export default function WalletPage({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { address } = use(params);
  const query = use(searchParams);
  const activity = useActivity(query.token);
  const tokens = useTokens();
  const related = useMemo(
    () => (activity.data ?? []).filter((item) => item.wallet.toLowerCase() === address.toLowerCase()),
    [activity.data, address],
  );
  const token = tokens.data?.find((item) => item.address.toLowerCase() === query.token?.toLowerCase()) ?? tokens.data?.[0];
  const holder = token ? getMockHolders(token.address).find((row) => row.wallet.toLowerCase() === address.toLowerCase()) : undefined;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Public wallet</p>
        <h1 className="font-display mt-2 text-3xl">{shortAddress(address, 8)}</h1>
        <a href={explorerAddress(address)} className="mt-2 inline-block font-mono text-sm text-accent" target="_blank" rel="noreferrer">
          {address}
        </a>
        <p className="mt-4 text-sm text-muted">Only public on-chain activity is shown. StakeBro does not expose private information.</p>
        {holder && token ? (
          <p className="mt-3 text-sm">
            {formatNumber(holder.balance)} {token.symbol} · {holder.percent.toFixed(2)}% of circulating supply
          </p>
        ) : null}
      </div>
      <section className="card p-5">
        <h2 className="font-display text-xl">On-chain activity</h2>
        <div className="mt-4">
          <ActivityFeed items={related} />
          {!related.length ? <p className="text-sm text-muted">No indexed events for this wallet in the current catalog.</p> : null}
        </div>
      </section>
      <Link href="/explore" className="text-sm text-accent">Back to explore</Link>
    </div>
  );
}
