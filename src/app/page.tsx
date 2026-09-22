"use client";

import Link from "next/link";
import { ArrowRight, Coins, LineChart, Rocket, Shield } from "lucide-react";
import { TokenCard } from "@/components/tokens/token-card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { TokenCardSkeleton } from "@/components/ui/skeleton";
import { useOverview, useTokens } from "@/hooks/useMarket";
import { formatNumber, formatUsd } from "@/lib/format";

const steps = [
  { title: "Discover", body: "Browse tokens launched on Robinhood Chain with market, holder, and staking context." },
  { title: "Buy", body: "Review quotes, fees, and price impact before confirming a swap in your wallet." },
  { title: "Hold", body: "Track balances and watchlists from a connected wallet without sharing a seed phrase." },
  { title: "Stake", body: "Deposit compatible tokens into pools configured by the staking contract." },
  { title: "Earn", body: "Rewards accrue according to stake size, duration, and the pool emission rate." },
  { title: "Claim", body: "Claim or compound rewards through wallet-confirmed contract calls." },
];

export default function HomePage() {
  const overview = useOverview();
  const trending = useTokens({ sort: "trending", filter: "trending" });
  const newest = useTokens({ sort: "newest" });
  const stakable = useTokens({ filter: "stakable", sort: "apr" });

  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 pt-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="animate-rise">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">Robinhood Chain · StakeBro</p>
          <h1 className="font-display mt-4 max-w-xl text-5xl leading-[1.05] tracking-tight sm:text-6xl">
            Launch. Trade. Stake. Earn.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
            Discover tokens on the Robinhood network, trade with confidence, and put your tokens to work through StakeBro staking.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/explore">Explore Tokens</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/launch">Launch a Token</Link>
            </Button>
          </div>
        </div>
        <div className="card relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,235,193,0.16),transparent_42%)]" />
          <p className="relative text-xs uppercase tracking-[0.18em] text-muted">How it works</p>
          <ol className="relative mt-4 space-y-3">
            {["Discover", "Buy", "Hold", "Stake", "Earn", "Claim", "Compound"].map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 font-mono text-xs text-accent">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <OverviewStat label="Total Market Cap" value={overview.data?.totalMarketCap ?? 0} format={formatUsd} />
          <OverviewStat label="24H Trading Volume" value={overview.data?.volume24h ?? 0} format={formatUsd} />
          <OverviewStat label="Total Tokens" value={overview.data?.totalTokens ?? 0} format={(v) => formatNumber(v, false)} />
          <OverviewStat label="Total Value Staked" value={overview.data?.totalValueStaked ?? 0} format={formatUsd} />
          <OverviewStat label="Total Staking Rewards" value={overview.data?.totalStakingRewards ?? 0} format={formatNumber} />
          <OverviewStat label="Active Stakers" value={overview.data?.activeStakers ?? 0} format={formatNumber} />
        </div>
      </section>

      <section>
        <SectionHead title="Trending tokens" href="/explore?filter=trending" />
        <TokenGrid tokens={trending.data?.slice(0, 3)} loading={trending.isPending} />
      </section>

      <section>
        <SectionHead title="New token launches" href="/explore?sort=newest" />
        <TokenGrid tokens={newest.data?.slice(0, 3)} loading={newest.isPending} />
      </section>

      <section>
        <SectionHead title="Top staking pools" href="/staking" />
        <div className="grid gap-4 md:grid-cols-3">
          {(stakable.data ?? []).slice(0, 3).map((token) => {
            const pool = token.pools[0];
            if (!pool) return null;
            return (
              <div key={token.address} className="card p-5">
                <p className="text-sm text-muted">{token.name}</p>
                <h3 className="font-display mt-1 text-2xl">{pool.label}</h3>
                <p className="mt-4 text-sm text-muted">APR</p>
                <p className="font-display text-4xl text-accent">{pool.apr.toFixed(2)}%</p>
                <p className="mt-3 text-sm text-muted">Lock period {pool.lock === "flexible" ? "None" : `${pool.lock} Days`}</p>
                <p className="text-sm text-muted">{pool.lock === "flexible" ? "Unstake anytime" : `Locked ${pool.lock} days`}</p>
                <Button asChild className="mt-5 w-full">
                  <Link href={`/token/${token.address}`}>Stake</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="card p-5">
            <h3 className="font-display text-xl">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-8">
          <Rocket className="text-accent" />
          <h2 className="font-display mt-4 text-3xl">Launch on StakeBro</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Create a token, set allocations, and prepare staking rewards. Every deployment requires wallet confirmation.
          </p>
          <Button asChild className="mt-6">
            <Link href="/launch">Launch a Token <ArrowRight size={16} /></Link>
          </Button>
        </div>
        <div className="card p-8">
          <Coins className="text-accent-2" />
          <h2 className="font-display mt-4 text-3xl">Put tokens to work</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Stake compatible tokens, track pending rewards, and claim or compound through the staking contract.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/staking">Open staking <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <Shield className="text-accent" />
          <h3 className="mt-3 font-medium">No keys, no custody</h3>
          <p className="mt-2 text-sm text-muted">StakeBro never stores private keys or seed phrases. You confirm every transaction in your wallet.</p>
        </div>
        <div className="card p-5">
          <LineChart className="text-accent-2" />
          <h3 className="mt-3 font-medium">Public data only</h3>
          <p className="mt-2 text-sm text-muted">Holders, volume, and rewards are indexed from public chain activity. The chain remains the source of truth.</p>
        </div>
        <div className="card p-5">
          <Coins className="text-accent-3" />
          <h3 className="mt-3 font-medium">Fees stay visible</h3>
          <p className="mt-2 text-sm text-muted">Creator, platform, trading, and network fees are shown before you confirm.</p>
        </div>
      </section>
    </div>
  );
}

function OverviewStat({
  label,
  value,
  format,
}: {
  label: string;
  value: number;
  format: (value: number) => string;
}) {
  return (
    <div className="card p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl">
        <AnimatedNumber value={value} format={format} />
      </p>
    </div>
  );
}

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="font-display text-2xl">{title}</h2>
      <Link href={href} className="text-sm text-accent">
        View all
      </Link>
    </div>
  );
}

function TokenGrid({ tokens, loading }: { tokens?: ReturnType<typeof useTokens>["data"]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <TokenCardSkeleton />
        <TokenCardSkeleton />
        <TokenCardSkeleton />
      </div>
    );
  }
  if (!tokens?.length) {
    return <p className="text-sm text-muted">No tokens in this list yet.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {tokens.map((token) => (
        <TokenCard key={token.address} token={token} />
      ))}
    </div>
  );
}
