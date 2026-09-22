"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TokenLogo } from "@/components/brand/token-logo";
import { Change } from "@/components/ui/stat";
import { useTokens } from "@/hooks/useMarket";
import { formatUsd } from "@/lib/format";
import { Input } from "@/components/ui/input";

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { data } = useTokens();
  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value || !data) return [];
    return data
      .filter(
        (token) =>
          token.name.toLowerCase().includes(value) ||
          token.symbol.toLowerCase().includes(value) ||
          token.address.toLowerCase().includes(value) ||
          token.creator.toLowerCase().includes(value),
      )
      .slice(0, 8);
  }, [data, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      {compact ? (
        <button
          onClick={() => setOpen(true)}
          className="glass flex h-11 w-11 items-center justify-center rounded-full"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="glass hidden h-11 w-72 items-center gap-2 rounded-full px-4 text-sm text-muted lg:flex"
        >
          <Search size={16} />
          Search tokens
          <span className="ml-auto rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px]">⌘K</span>
        </button>
      )}
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="card mx-auto mt-24 max-w-xl p-4" onClick={(event) => event.stopPropagation()}>
            <Input
              autoFocus
              placeholder="Search tokens by name or contract address"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="mt-3 grid gap-1">
              {results.map((token) => (
                <Link
                  key={token.address}
                  href={`/token/${token.address}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-white/5"
                >
                  <TokenLogo symbol={token.symbol} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{token.name}</p>
                    <p className="text-xs text-muted">{token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatUsd(token.priceUsd)}</p>
                    <Change value={token.change24h} className="text-xs" />
                  </div>
                </Link>
              ))}
              {query && results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted">No tokens matched that search.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
