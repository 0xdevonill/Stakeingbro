const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const fullCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const fullNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export function formatUsd(value: number, compact = true) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) < 0.01 && value !== 0) {
    return value < 0 ? "-<$0.01" : "<$0.01";
  }
  return compact ? compactCurrency.format(value) : fullCurrency.format(value);
}

export function formatNumber(value: number, compact = true) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1_000 && compact) return compactNumber.format(value);
  if (Math.abs(value) < 0.0001 && value !== 0) return value.toExponential(2);
  if (Math.abs(value) < 1) return value.toPrecision(4);
  return fullNumber.format(value);
}

export function formatTokenAmount(value: number, symbol?: string) {
  const amount = formatNumber(value);
  return symbol ? `${amount} ${symbol}` : amount;
}

export function formatPercent(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatApr(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(2)}%`;
}

export function formatDate(value: string | number | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string | number | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function timeAgo(value: string | number | Date) {
  const delta = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.round(delta / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

export function formatDuration(seconds: number) {
  if (seconds <= 0) return "0s";
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatBps(bps: number) {
  return `${(bps / 100).toFixed(2)}%`;
}
