"use client";

import { useQuery } from "@tanstack/react-query";
import { dataSource, type TokenQuery } from "@/services/data";
import type { ChartRange } from "@/types";

export function useTokens(query: TokenQuery = {}) {
  return useQuery({
    queryKey: ["tokens", query],
    queryFn: () => dataSource.listTokens(query),
  });
}

export function useToken(address: string) {
  return useQuery({
    queryKey: ["token", address],
    queryFn: () => dataSource.getToken(address),
    enabled: Boolean(address),
  });
}

export function useOverview() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: () => dataSource.overview(),
  });
}

export function useTokenChart(address: string, range: ChartRange) {
  return useQuery({
    queryKey: ["chart", address, range],
    queryFn: () => dataSource.chart(address, range),
    enabled: Boolean(address),
  });
}

export function useHolders(address: string) {
  return useQuery({
    queryKey: ["holders", address],
    queryFn: () => dataSource.holders(address),
    enabled: Boolean(address),
  });
}

export function useActivity(address?: string) {
  return useQuery({
    queryKey: ["activity", address ?? "all"],
    queryFn: () => dataSource.activity(address),
  });
}

export function useCreator(address: string) {
  return useQuery({
    queryKey: ["creator", address],
    queryFn: () => dataSource.creator(address),
    enabled: Boolean(address),
  });
}
