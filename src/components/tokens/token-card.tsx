import Link from "next/link";
import { TokenLogo } from "@/components/brand/token-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Change, Usd } from "@/components/ui/stat";
import { formatApr, formatNumber, formatUsd } from "@/lib/format";
import { timeAgo } from "@/lib/format";
import { shortAddress } from "@/lib/utils";
import type { TokenRecord } from "@/types";

export function TokenCard({ token }: { token: TokenRecord }) {
  return (
    <article className="card card-hover p-4">
      <div className="flex items-start gap-3">
        <TokenLogo symbol={token.symbol} />
        <div className="min-w-0 flex-1">
          <Link href={`/token/${token.address}`} className="block truncate font-medium hover:text-accent">
            {token.name}
          </Link>
          <p className="text-xs text-muted">
            {token.symbol} · {shortAddress(token.address)}
          </p>
        </div>
        <div className="text-right">
          <Usd value={token.priceUsd} />
          <div className="text-xs">
            <Change value={token.change24h} />
          </div>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">Market cap</dt>
          <dd>{formatUsd(token.marketCap)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">24h volume</dt>
          <dd>{formatUsd(token.volume24h)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">Holders</dt>
          <dd>{formatNumber(token.holders)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">APR</dt>
          <dd>{token.stakable ? formatApr(token.apr) : "—"}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {token.verified === "verified" ? <Badge tone="accent">Verified</Badge> : <Badge tone="warning">Unverified</Badge>}
        {token.stakable ? <Badge tone="info">Stakable</Badge> : null}
        {token.trending ? <Badge>Trending</Badge> : null}
        <span className="ml-auto text-xs text-muted">{timeAgo(token.createdAt)}</span>
        <Button asChild size="sm">
          <Link href={`/token/${token.address}`}>Buy</Link>
        </Button>
      </div>
    </article>
  );
}

export function TokenRow({ token }: { token: TokenRecord }) {
  return (
    <Link
      href={`/token/${token.address}`}
      className="grid grid-cols-2 items-center gap-3 rounded-2xl px-3 py-3 text-sm hover:bg-white/4 md:grid-cols-8"
    >
      <div className="col-span-2 flex items-center gap-3">
        <TokenLogo symbol={token.symbol} size={32} />
        <div>
          <p>{token.name}</p>
          <p className="text-xs text-muted">{token.symbol}</p>
        </div>
      </div>
      <p className="hidden md:block">{formatUsd(token.priceUsd)}</p>
      <p className="hidden md:block">{formatUsd(token.marketCap)}</p>
      <p className="hidden md:block">
        <Change value={token.change24h} />
      </p>
      <p className="hidden md:block">{formatUsd(token.volume24h)}</p>
      <p className="hidden md:block">{formatNumber(token.holders)}</p>
      <p className="text-right">{token.stakable ? formatApr(token.apr) : "—"}</p>
    </Link>
  );
}
