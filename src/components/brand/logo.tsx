import { cn } from "@/lib/utils";

export function StakeBroMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-8 w-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id="sb-a" x1="8" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5EEBC1" />
          <stop offset="1" stopColor="#7AA2FF" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="37" height="37" rx="12" fill="#0C1118" stroke="url(#sb-a)" strokeWidth="1.5" />
      <path
        d="M12 26V14.5c0-2 1.5-3.5 3.6-3.5h5.3c3.3 0 5.6 2 5.6 4.8 0 2.2-1.2 3.8-3.3 4.5 2.5.7 4 2.5 4 5 0 3.2-2.6 5.2-6.2 5.2H15.6C13.5 30.5 12 29 12 27"
        fill="none"
        stroke="url(#sb-a)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M18 18.2h4.1M18 23.8h5.2" stroke="#E8B86D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StakeBroLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <StakeBroMark />
      {compact ? null : (
        <span className="font-display text-[1.15rem] font-semibold tracking-tight">
          Stake<span className="text-accent">Bro</span>
        </span>
      )}
    </span>
  );
}
