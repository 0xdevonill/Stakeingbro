import Link from "next/link";
import { formatNumber, formatUsd, timeAgo } from "@/lib/format";
import { shortAddress } from "@/lib/utils";
import type { ActivityItem, HolderRow } from "@/types";

const colors: Record<ActivityItem["type"], string> = {
  buy: "bg-accent",
  sell: "bg-danger",
  stake: "bg-accent-2",
  unstake: "bg-warning",
  claim: "bg-fuchsia-400",
  compound: "bg-accent-3",
  create: "bg-white",
  liquidity: "bg-sky-400",
  holder: "bg-warning",
};

const verbs: Record<ActivityItem["type"], string> = {
  buy: "bought",
  sell: "sold",
  stake: "staked",
  unstake: "unstaked",
  claim: "claimed",
  compound: "compounded",
  create: "created",
  liquidity: "added liquidity",
  holder: "became a holder of",
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (!items.length) {
    return <p className="text-sm text-muted">No indexed activity yet.</p>;
  }
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-3 rounded-2xl bg-surface-2 px-3 py-3 text-sm">
          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${colors[item.type]}`} />
          <div className="min-w-0 flex-1">
            <p>
              Wallet{" "}
              <Link href={`/wallet/${item.wallet}`} className="font-mono text-accent">
                {shortAddress(item.wallet)}
              </Link>{" "}
              {verbs[item.type]} {formatNumber(item.amount)} {item.symbol}
            </p>
            <p className="text-xs text-muted">
              {timeAgo(item.timestamp)} · {item.status}
              {item.hash ? ` · ${shortAddress(item.hash, 6)}` : " · development event"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HoldersTable({ rows, symbol, tokenAddress }: { rows: HolderRow[]; symbol: string; tokenAddress: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted">
          <tr>
            <th className="py-3">Rank</th>
            <th>Wallet</th>
            <th>Balance</th>
            <th>Supply</th>
            <th>Value</th>
            <th>Staked</th>
            <th>Last activity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.wallet} className="border-t border-border">
              <td className="py-3">#{row.rank}</td>
              <td>
                <Link href={`/wallet/${row.wallet}?token=${tokenAddress}`} className="font-mono text-accent">
                  {shortAddress(row.wallet)}
                </Link>
              </td>
              <td>
                {formatNumber(row.balance)} {symbol}
              </td>
              <td>{row.percent.toFixed(2)}%</td>
              <td>{formatUsd(row.valueUsd)}</td>
              <td>{formatNumber(row.staked)}</td>
              <td className="text-muted">{timeAgo(row.lastActivity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
