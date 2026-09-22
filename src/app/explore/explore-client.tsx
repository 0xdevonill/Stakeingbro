"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TokenCard, TokenRow } from "@/components/tokens/token-card";
import { Input } from "@/components/ui/input";
import { TokenCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useTokens } from "@/hooks/useMarket";
import type { TokenQuery } from "@/services/data";

const sorts: { id: NonNullable<TokenQuery["sort"]>; label: string }[] = [
  { id: "marketCap", label: "Market Cap" },
  { id: "volume", label: "Volume" },
  { id: "newest", label: "Newest" },
  { id: "trending", label: "Trending" },
  { id: "holders", label: "Most Holders" },
  { id: "staked", label: "Highest Staked" },
  { id: "apr", label: "Highest APR" },
];

const filters: { id: NonNullable<TokenQuery["filter"]>; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New Tokens" },
  { id: "trending", label: "Trending" },
  { id: "stakable", label: "Stakable" },
  { id: "high-liquidity", label: "High Liquidity" },
  { id: "low-mcap", label: "Low Market Cap" },
  { id: "verified", label: "Verified" },
  { id: "recent", label: "Recently Launched" },
];

export default function ExplorePage() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<NonNullable<TokenQuery["sort"]>>(
    (params.get("sort") as TokenQuery["sort"]) || "marketCap",
  );
  const [filter, setFilter] = useState<NonNullable<TokenQuery["filter"]>>(
    (params.get("filter") as TokenQuery["filter"]) || "all",
  );
  const [view, setView] = useState<"cards" | "table">("cards");
  const query = useMemo(() => ({ search, sort, filter }), [search, sort, filter]);
  const { data, isLoading } = useTokens(query);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Discover</p>
        <h1 className="font-display mt-2 text-4xl">Explore tokens</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Search tokens by name or contract address. Sort and filter public market data.
        </p>
      </div>
      <Input
        placeholder="Search tokens by name or contract address"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`shrink-0 rounded-full px-3 py-2 text-sm ${filter === item.id ? "bg-accent text-[#05261b]" : "bg-surface-2"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {sorts.map((item) => (
          <button
            key={item.id}
            onClick={() => setSort(item.id)}
            className={`rounded-full px-3 py-1.5 text-xs ${sort === item.id ? "bg-white/8 text-accent" : "text-muted"}`}
          >
            {item.label}
          </button>
        ))}
        <div className="ml-auto flex rounded-full bg-surface-2 p-1">
          <button className={`rounded-full px-3 py-1 text-xs ${view === "cards" ? "bg-white/8" : ""}`} onClick={() => setView("cards")}>
            Cards
          </button>
          <button className={`rounded-full px-3 py-1 text-xs ${view === "table" ? "bg-white/8" : ""}`} onClick={() => setView("table")}>
            Table
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <TokenCardSkeleton />
          <TokenCardSkeleton />
        </div>
      ) : !data?.length ? (
        <EmptyState
          title="No tokens found"
          body="Try a different search, sort, or filter. If an indexer is connected, StakeBro will load indexed Robinhood Chain listings here."
        />
      ) : view === "cards" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((token) => (
            <TokenCard key={token.address} token={token} />
          ))}
        </div>
      ) : (
        <div className="card p-2">
          <div className="hidden grid-cols-8 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-muted md:grid">
            <span className="col-span-2">Token</span>
            <span>Price</span>
            <span>Market cap</span>
            <span>24h</span>
            <span>Volume</span>
            <span>Holders</span>
            <span className="text-right">APR</span>
          </div>
          {data.map((token) => (
            <TokenRow key={token.address} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}
