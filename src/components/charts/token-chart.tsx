"use client";

import { useMemo, useState } from "react";
import { formatDateTime, formatNumber, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CandlePoint, ChartRange } from "@/types";

const ranges: ChartRange[] = ["1H", "4H", "1D", "1W", "1M", "1Y", "ALL"];
const metrics = ["price", "volume", "marketCap"] as const;

export function TokenChart({
  points,
  range,
  onRange,
}: {
  points: CandlePoint[];
  range: ChartRange;
  onRange: (range: ChartRange) => void;
}) {
  const [metric, setMetric] = useState<(typeof metrics)[number]>("price");
  const path = useMemo(() => {
    if (!points.length) return "";
    const values = points.map((point) => (metric === "price" ? point.close : metric === "volume" ? point.volume : point.marketCap));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    return values
      .map((value, index) => {
        const x = (index / Math.max(values.length - 1, 1)) * 100;
        const y = 100 - ((value - min) / span) * 100;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [points, metric]);

  const last = points[points.length - 1];
  const first = points[0];
  const up = last && first ? last.close >= first.open : true;

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-full bg-surface-2 p-1">
          {metrics.map((item) => (
            <button
              key={item}
              onClick={() => setMetric(item)}
              className={cn("rounded-full px-3 py-1.5 text-xs capitalize", metric === item && "bg-white/8")}
            >
              {item === "marketCap" ? "Market cap" : item}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap rounded-full bg-surface-2 p-1">
          {ranges.map((item) => (
            <button
              key={item}
              onClick={() => onRange(item)}
              className={cn("rounded-full px-2.5 py-1.5 text-xs", range === item && "bg-white/8 text-accent")}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 text-sm text-muted">
        {last ? (
          metric === "price" ? (
            formatUsd(last.close)
          ) : metric === "volume" ? (
            formatUsd(last.volume)
          ) : (
            formatUsd(last.marketCap)
          )
        ) : (
          "—"
        )}
        {last ? <span className="ml-3">Buys {last.buys} · Sells {last.sells}</span> : null}
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-4 h-64 w-full overflow-visible">
        <defs>
          <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={up ? "#5EEBC1" : "#FF6B84"} stopOpacity="0.28" />
            <stop offset="100%" stopColor={up ? "#5EEBC1" : "#FF6B84"} stopOpacity="0" />
          </linearGradient>
        </defs>
        {path ? (
          <>
            <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#chart-fill)" className="animate-rise" />
            <path d={path} fill="none" stroke={up ? "#5EEBC1" : "#FF6B84"} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          </>
        ) : null}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        <span>{first ? formatDateTime(first.time) : ""}</span>
        <span>Volume {last ? formatNumber(last.volume) : "—"}</span>
      </div>
    </div>
  );
}
