"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

const KEY = "stakebro.watchlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

let snapshot = read();
const listeners = new Set<() => void>();

function emit() {
  snapshot = read();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  return <WatchlistContext.Provider value={true}>{children}</WatchlistContext.Provider>;
}

const WatchlistContext = createContext(false);

export function useWatchlist() {
  useContext(WatchlistContext);
  const addresses = useSyncExternalStore(subscribe, () => snapshot, () => [] as string[]);

  return useMemo(
    () => ({
      addresses,
      has: (address: string) => addresses.some((item) => item.toLowerCase() === address.toLowerCase()),
      toggle(address: string) {
        const current = read();
        const exists = current.some((item) => item.toLowerCase() === address.toLowerCase());
        const next = exists
          ? current.filter((item) => item.toLowerCase() !== address.toLowerCase())
          : [...current, address];
        localStorage.setItem(KEY, JSON.stringify(next));
        emit();
      },
    }),
    [addresses],
  );
}
