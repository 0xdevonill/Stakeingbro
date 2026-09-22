"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, Compass, Home, Rocket, Wallet } from "lucide-react";
import { mobileNavItems } from "@/config/site";
import { cn } from "@/lib/utils";

const icons = {
  home: Home,
  compass: Compass,
  coins: Coins,
  rocket: Rocket,
  wallet: Wallet,
};

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="glass fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-3xl p-1 lg:hidden">
      {mobileNavItems.map((item) => {
        const Icon = icons[item.icon];
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl py-2 text-[10px] uppercase tracking-[0.12em] text-muted",
              active && "bg-white/6 text-accent",
            )}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
