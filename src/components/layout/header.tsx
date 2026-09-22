"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { StakeBroLogo } from "@/components/brand/logo";
import { SearchBox } from "@/components/search/search-box";
import { ConnectWallet, NetworkSelector } from "@/components/wallet/connect-wallet";
import { navItems } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-[#05070b]/78 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="shrink-0" aria-label="StakeBro home">
          <StakeBroLogo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm text-muted transition hover:text-foreground",
                pathname === item.href && "bg-white/5 text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:block">
            <SearchBox />
          </div>
          <div className="lg:hidden">
            <SearchBox compact />
          </div>
          <NetworkSelector />
          <ConnectWallet />
          <button
            className="glass flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Open menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border bg-background px-4 py-3 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-sm text-muted hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
