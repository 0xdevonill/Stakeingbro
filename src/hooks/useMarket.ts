"use client";

import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { dataSource, type TokenQuery } from "@/services/data";
import type { ChartRange } from "@/types";

const EMPTY_QUERY: TokenQuery = {};

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useTokens(query: TokenQuery = EMPTY_QUERY) {
  const isClient = useIsClient();
  return useQuery({
    queryKey: ["tokens", query.search ?? "", query.sort ?? "marketCap", query.filter ?? "all"],
    queryFn: () => dataSource.listTokens(query),
    enabled: isClient,
  });
}

export function useToken(address: string) {
  const isClient = useIsClient();
  return useQuery({
    queryKey: ["token", address.toLowerCase()],
    queryFn: () => dataSource.getToken(address),
    enabled: isClient && Boolean(address),
  });
}

export function useOverview() {
  const isClient = useIsClient();
  return useQuery({
    queryKey: ["overview"],
    queryFn: () => dataSource.overview(),
    enabled: isClient,
  });
}

export function useTokenChart(address: string, range: ChartRange) {
  const isClient = useIsClient();
  return useQuery({
    queryKey: ["chart", address.toLowerCase(), range],
    queryFn: () => dataSource.chart(address, range),
    enabled: isClient && Boolean(address),
  });
}

export function useHolders(address: string) {
  const isClient = useIsClient();
  return useQuery({
    queryKey: ["holders", address.toLowerCase()],
    queryFn: () => dataSource.holders(address),
    enabled: isClient && Boolean(address),
  });
}

export function useActivity(address?: string) {
  const isClient = useIsClient();
  return useQuery({
    queryKey: ["activity", address?.toLowerCase() ?? "all"],
    queryFn: () => dataSource.activity(address),
    enabled: isClient,
  });
}

export function useCreator(address: string) {
  const isClient = useIsClient();
  return useQuery({
    queryKey: ["creator", address.toLowerCase()],
    queryFn: () => dataSource.creator(address),
    enabled: isClient && Boolean(address),
  });
}
