"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ActivityItem, StakingPosition } from "@/types";
import { getMockPositions } from "@/services/mock/catalog";

type TxInput = Omit<ActivityItem, "id" | "timestamp" | "status"> & { status?: ActivityItem["status"] };

interface SimulationState {
  positions: StakingPosition[];
  txs: ActivityItem[];
  holdings: Record<string, number>;
  recordTx: (input: TxInput) => ActivityItem;
  applyStake: (token: `0x${string}`, poolId: string, amount: number, symbol: string, wallet: `0x${string}`) => ActivityItem;
  applyUnstake: (token: `0x${string}`, poolId: string, amount: number, symbol: string, wallet: `0x${string}`) => ActivityItem;
  applyClaim: (token: `0x${string}`, poolId: string, amount: number, symbol: string, wallet: `0x${string}`) => ActivityItem;
  applyCompound: (token: `0x${string}`, poolId: string, amount: number, symbol: string, wallet: `0x${string}`) => ActivityItem;
  applyTrade: (side: "buy" | "sell", token: `0x${string}`, amount: number, symbol: string, wallet: `0x${string}`) => ActivityItem;
}

const SimulationContext = createContext<SimulationState | null>(null);

function id() {
  return `sim-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [positions, setPositions] = useState<StakingPosition[]>(getMockPositions());
  const [txs, setTxs] = useState<ActivityItem[]>([]);
  const [holdings, setHoldings] = useState<Record<string, number>>({
    [getMockPositions()[0]?.token ?? ""]: 180_000,
  });

  const recordTx = useCallback((input: TxInput) => {
    const item: ActivityItem = {
      ...input,
      id: id(),
      timestamp: new Date().toISOString(),
      status: input.status ?? "confirmed",
    };
    setTxs((current) => [item, ...current]);
    return item;
  }, []);

  const applyStake = useCallback<SimulationState["applyStake"]>(
    (token, poolId, amount, symbol, wallet) => {
      setPositions((current) =>
        current.map((position) =>
          position.token === token && position.poolId === poolId
            ? {
                ...position,
                staked: position.staked + amount,
                dailyReward: position.dailyReward * ((position.staked + amount) / Math.max(position.staked, 1)),
              }
            : position,
        ),
      );
      setHoldings((current) => ({ ...current, [token]: Math.max(0, (current[token] ?? 0) - amount) }));
      return recordTx({ type: "stake", token, amount, symbol, wallet, usdValue: 0 });
    },
    [recordTx],
  );

  const applyUnstake = useCallback<SimulationState["applyUnstake"]>(
    (token, poolId, amount, symbol, wallet) => {
      setPositions((current) =>
        current.map((position) =>
          position.token === token && position.poolId === poolId
            ? { ...position, staked: Math.max(0, position.staked - amount) }
            : position,
        ),
      );
      setHoldings((current) => ({ ...current, [token]: (current[token] ?? 0) + amount }));
      return recordTx({ type: "unstake", token, amount, symbol, wallet, usdValue: 0 });
    },
    [recordTx],
  );

  const applyClaim = useCallback<SimulationState["applyClaim"]>(
    (token, poolId, amount, symbol, wallet) => {
      setPositions((current) =>
        current.map((position) =>
          position.token === token && position.poolId === poolId
            ? { ...position, pendingRewards: 0, earned: position.earned + amount }
            : position,
        ),
      );
      return recordTx({ type: "claim", token, amount, symbol, wallet, usdValue: 0 });
    },
    [recordTx],
  );

  const applyCompound = useCallback<SimulationState["applyCompound"]>(
    (token, poolId, amount, symbol, wallet) => {
      setPositions((current) =>
        current.map((position) =>
          position.token === token && position.poolId === poolId
            ? {
                ...position,
                staked: position.staked + amount,
                pendingRewards: 0,
                earned: position.earned + amount,
              }
            : position,
        ),
      );
      return recordTx({ type: "compound", token, amount, symbol, wallet, usdValue: 0 });
    },
    [recordTx],
  );

  const applyTrade = useCallback<SimulationState["applyTrade"]>(
    (side, token, amount, symbol, wallet) => {
      setHoldings((current) => ({
        ...current,
        [token]: Math.max(0, (current[token] ?? 0) + (side === "buy" ? amount : -amount)),
      }));
      return recordTx({ type: side, token, amount, symbol, wallet, usdValue: 0 });
    },
    [recordTx],
  );

  const value = useMemo(
    () => ({
      positions,
      txs,
      holdings,
      recordTx,
      applyStake,
      applyUnstake,
      applyClaim,
      applyCompound,
      applyTrade,
    }),
    [positions, txs, holdings, recordTx, applyStake, applyUnstake, applyClaim, applyCompound, applyTrade],
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const value = useContext(SimulationContext);
  if (!value) throw new Error("SimulationProvider is required");
  return value;
}
