import { formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Change({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn(value >= 0 ? "positive" : "negative", className)}>{formatPercent(value)}</span>
  );
}

export function Usd({ value, compact = true }: { value: number; compact?: boolean }) {
  return <span className="font-medium tabular-nums">{formatUsd(value, compact)}</span>;
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="card p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
