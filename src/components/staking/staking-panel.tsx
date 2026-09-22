"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { env, hasStakingFactory, isMockMode } from "@/config/env";
import { useSimulation } from "@/hooks/useSimulation";
import { formatApr, formatDuration, formatNumber, formatTokenAmount } from "@/lib/format";
import { errorMessage } from "@/lib/errors";
import type { StakingLock, StakingPool, StakingPosition, TokenRecord } from "@/types";

const percents = [25, 50, 75, 100] as const;

export function StakingPanel({ token }: { token: TokenRecord }) {
  const { address, isConnected } = useAccount();
  const { positions, holdings, applyStake, applyUnstake, applyClaim, applyCompound } = useSimulation();
  const position = positions.find((item) => item.token === token.address);
  const [mode, setMode] = useState<"stake" | "unstake" | "claim" | "compound" | null>(null);
  const [poolId, setPoolId] = useState(token.pools[0]?.id);
  const [amount, setAmount] = useState("");
  const pool = token.pools.find((item) => item.id === poolId) ?? token.pools[0];
  const available = holdings[token.address] ?? 180_000;
  const numeric = Number(amount) || 0;

  if (!token.stakable || token.pools.length === 0) {
    return (
      <EmptyState
        title="Staking not enabled"
        body="This token does not currently expose a staking pool configuration."
      />
    );
  }

  function requireWallet() {
    if (!isConnected || !address) {
      toast.error(errorMessage("NOT_CONNECTED").title, { description: errorMessage("NOT_CONNECTED").body });
      return false;
    }
    return true;
  }

  function finish(message: string) {
    setMode(null);
    setAmount("");
    toast.success(isMockMode ? "Simulated in development mode" : message, {
      description: isMockMode
        ? "No blockchain transaction was sent. Local development state was updated."
        : "Confirm the request in your wallet. StakeBro does not custody funds.",
    });
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Stake & Earn</p>
          <h3 className="font-display mt-1 text-2xl">{token.symbol} staking</h3>
        </div>
        <p className="max-w-sm text-xs leading-5 text-muted">
          APR and reward rates come from the configured staking pool and can change. Rewards are not guaranteed profits.
        </p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Your Staked" value={formatTokenAmount(position?.staked ?? 0, token.symbol)} />
        <Metric label="Current APR" value={formatApr(position?.apr ?? pool.apr)} />
        <Metric label="Pending Rewards" value={formatTokenAmount(position?.pendingRewards ?? 0, token.symbol)} />
        <Metric label="Estimated Daily Reward" value={formatTokenAmount(position?.dailyReward ?? 0, token.symbol)} />
        <Metric label="Total Rewards Earned" value={formatTokenAmount(position?.earned ?? 0, token.symbol)} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {token.pools.map((item) => (
          <button
            key={item.id}
            onClick={() => setPoolId(item.id)}
            className={`rounded-2xl border p-4 text-left ${poolId === item.id ? "border-accent/40 bg-accent/5" : "border-border bg-surface-2"}`}
          >
            <p className="font-medium">{item.label}</p>
            <p className="mt-2 font-display text-2xl">{formatApr(item.apr)}</p>
            <p className="mt-2 text-sm text-muted">Lock period: {lockLabel(item.lock)}</p>
            <p className="text-sm text-muted">{item.lock === "flexible" ? "Flexible — Unstake Anytime" : "Locked until maturity"}</p>
          </button>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button onClick={() => setMode("stake")}>Stake</Button>
        <Button variant="secondary" onClick={() => setMode("claim")}>Claim Rewards</Button>
        <Button variant="secondary" onClick={() => setMode("compound")}>Compound</Button>
        <Button variant="outline" onClick={() => setMode("unstake")}>Unstake</Button>
      </div>

      <Modal open={mode === "stake"} onOpenChange={() => setMode(null)} title={`Stake ${token.symbol}`} description="Approve the staking contract if needed, then confirm the deposit in your wallet.">
        <p className="text-sm text-muted">Available balance {formatNumber(available)} {token.symbol}</p>
        <Input className="mt-3" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
        <PercentRow balance={available} onPick={setAmount} />
        <dl className="mt-4 grid gap-2 text-sm">
          <Row label="Estimated daily reward" value={formatNumber((numeric * pool.apr) / 100 / 365)} />
          <Row label="Estimated monthly reward" value={formatNumber((numeric * pool.apr) / 100 / 12)} />
          <Row label="Current APR" value={formatApr(pool.apr)} />
        </dl>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => toast.message("Approval required", { description: "If the staking contract is configured, your wallet will ask to approve token spending first." })}>
            Approve
          </Button>
          <Button
            onClick={() => {
              if (!requireWallet() || !address || !pool) return;
              if (!hasStakingFactory && !isMockMode) {
                toast.error(errorMessage("CONTRACT_UNAVAILABLE").title, { description: errorMessage("CONTRACT_UNAVAILABLE").body });
                return;
              }
              applyStake(token.address, pool.id, numeric, token.symbol, address);
              finish("Stake submitted");
            }}
          >
            Stake
          </Button>
        </div>
      </Modal>

      <Modal open={mode === "claim"} onOpenChange={() => setMode(null)} title="Claim Rewards">
        <dl className="grid gap-2 text-sm">
          <Row label="Rewards available" value={formatTokenAmount(position?.pendingRewards ?? 0, token.symbol)} />
          <Row label="Network fee" value={`~0.00018 ${env.nativeSymbol}`} />
          <Row label="You receive" value={formatTokenAmount(position?.pendingRewards ?? 0, token.symbol)} />
        </dl>
        <Button
          className="mt-5 w-full"
          onClick={() => {
            if (!requireWallet() || !address || !position) return;
            applyClaim(token.address, position.poolId, position.pendingRewards, token.symbol, address);
            finish("Rewards claimed");
          }}
        >
          Claim Rewards
        </Button>
      </Modal>

      <Modal open={mode === "compound"} onOpenChange={() => setMode(null)} title="Compound Rewards" description="Pending rewards are added to your staking position.">
        <dl className="grid gap-2 text-sm">
          <Row label="Current stake" value={formatTokenAmount(position?.staked ?? 0, token.symbol)} />
          <Row label="Pending rewards" value={formatTokenAmount(position?.pendingRewards ?? 0, token.symbol)} />
          <Row label="New stake" value={formatTokenAmount((position?.staked ?? 0) + (position?.pendingRewards ?? 0), token.symbol)} />
        </dl>
        <Button
          className="mt-5 w-full"
          onClick={() => {
            if (!requireWallet() || !address || !position) return;
            applyCompound(token.address, position.poolId, position.pendingRewards, token.symbol, address);
            finish("Compound submitted");
          }}
        >
          Compound Rewards
        </Button>
      </Modal>

      <Modal open={mode === "unstake"} onOpenChange={() => setMode(null)} title={`Unstake ${token.symbol}`}>
        <UnstakeCopy position={position} pool={pool} />
        <Input className="mt-3" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
        <PercentRow balance={position?.staked ?? 0} onPick={setAmount} />
        <Button
          className="mt-5 w-full"
          variant="outline"
          onClick={() => {
            if (!requireWallet() || !address || !position) return;
            if (position.lock !== "flexible" && position.unlockAt && +new Date(position.unlockAt) > Date.now()) {
              toast.error("Still locked", { description: "This pool has a remaining lock period. Flexible pools can be unstaked anytime." });
              return;
            }
            applyUnstake(token.address, position.poolId, numeric, token.symbol, address);
            finish("Unstake submitted");
          }}
        >
          Unstake
        </Button>
      </Modal>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-display text-xl">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function PercentRow({ balance, onPick }: { balance: number; onPick: (value: string) => void }) {
  return (
    <div className="mt-3 flex gap-2">
      {percents.map((value) => (
        <button
          key={value}
          className="flex-1 rounded-full bg-surface-2 py-2 text-xs"
          onClick={() => onPick(String((balance * value) / 100))}
        >
          {value === 100 ? "MAX" : `${value}%`}
        </button>
      ))}
    </div>
  );
}

function lockLabel(lock: StakingLock) {
  return lock === "flexible" ? "None" : `${lock} Days`;
}

function remainingLockSeconds(unlockAt?: string) {
  if (!unlockAt) return 0;
  const unlock = Date.parse(unlockAt);
  if (!Number.isFinite(unlock)) return 0;
  const reference = Date.parse("2026-09-22T12:00:00.000Z");
  return Math.max(0, (unlock - reference) / 1000);
}

function UnstakeCopy({ position, pool }: { position?: StakingPosition; pool?: StakingPool }) {
  const remaining = remainingLockSeconds(position?.unlockAt);
  return (
    <dl className="grid gap-2 text-sm">
      <Row label="Current staked amount" value={formatNumber(position?.staked ?? 0)} />
      <Row label="Available to unstake" value={position?.lock === "flexible" ? formatNumber(position.staked) : remaining === 0 ? formatNumber(position?.staked ?? 0) : "0"} />
      <Row label="Lock period" value={pool ? lockLabel(pool.lock) : "—"} />
      <Row label="Remaining lock time" value={pool?.lock === "flexible" ? "Flexible — Unstake Anytime" : formatDuration(remaining)} />
      <Row label="Potential penalty" value="None configured" />
      <Row label="Estimated network fee" value={`~0.0002 ${env.nativeSymbol}`} />
    </dl>
  );
}

export function RewardTicker({ position, symbol }: { position?: StakingPosition; symbol: string }) {
  const pending = position?.pendingRewards ?? 0;
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Pending Rewards</p>
      <p className="mt-2 font-display text-3xl">{formatNumber(pending)} {symbol}</p>
      <p className="mt-2 text-sm text-accent">Reward rate +{position?.rewardRatePerSecond ?? 0} {symbol}/sec</p>
      <p className="text-xs text-muted">Next daily snapshot depends on the staking contract configuration.</p>
    </div>
  );
}
