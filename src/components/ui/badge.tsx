import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "default" | "accent" | "warning" | "danger" | "info" }) {
  const tones = {
    default: "bg-white/5 text-muted",
    accent: "bg-accent/12 text-accent",
    warning: "bg-warning/12 text-warning",
    danger: "bg-danger/12 text-danger",
    info: "bg-accent-2/12 text-accent-2",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
