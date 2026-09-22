"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { TokenLogo } from "@/components/brand/token-logo";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { env, hasTokenFactory, isMockMode } from "@/config/env";
import { errorMessage } from "@/lib/errors";
import { formatNumber } from "@/lib/format";

const initial = {
  name: "",
  symbol: "",
  description: "",
  logo: "",
  website: "",
  x: "",
  telegram: "",
  discord: "",
  totalSupply: "10000000",
  decimals: "18",
  initialLiquidity: "2",
  creatorAllocation: "10",
  stakingAllocation: "20",
  rewardAllocation: "15",
};

export default function LaunchPage() {
  const { isConnected } = useAccount();
  const [form, setForm] = useState(initial);
  const [confirm, setConfirm] = useState(false);
  const supply = Number(form.totalSupply) || 0;
  const creator = (supply * Number(form.creatorAllocation || 0)) / 100;
  const staking = (supply * Number(form.stakingAllocation || 0)) / 100;
  const rewards = (supply * Number(form.rewardAllocation || 0)) / 100;
  const remaining = supply - creator - staking - rewards;
  const valid = form.name && form.symbol && supply > 0 && remaining >= 0;

  const preview = useMemo(() => form, [form]);

  function set<K extends keyof typeof initial>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function deploy() {
    if (!isConnected) {
      toast.error(errorMessage("NOT_CONNECTED").title, { description: errorMessage("NOT_CONNECTED").body });
      return;
    }
    if (!hasTokenFactory && !isMockMode) {
      toast.error(errorMessage("CONTRACT_UNAVAILABLE").title, { description: errorMessage("CONTRACT_UNAVAILABLE").body });
      return;
    }
    setConfirm(false);
    toast.success(isMockMode ? "Launch simulated in development mode" : "Confirm token creation in your wallet", {
      description: isMockMode
        ? "No factory is configured, so no blockchain transaction was sent."
        : "The token factory will deploy after wallet confirmation.",
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Creators</p>
        <h1 className="font-display mt-2 text-4xl">Launch Token</h1>
        <p className="mt-2 text-muted">Every deployment requires wallet confirmation. StakeBro does not hold the private key.</p>
        <div className="mt-8 grid gap-4">
          <Field label="Token name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Aurora Finance" /></Field>
          <Field label="Token symbol"><Input value={form.symbol} onChange={(e) => set("symbol", e.target.value.toUpperCase())} placeholder="AURA" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
          <Field label="Token logo URL"><Input value={form.logo} onChange={(e) => set("logo", e.target.value)} placeholder="https://" /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Website"><Input value={form.website} onChange={(e) => set("website", e.target.value)} /></Field>
            <Field label="X / Twitter"><Input value={form.x} onChange={(e) => set("x", e.target.value)} /></Field>
            <Field label="Telegram"><Input value={form.telegram} onChange={(e) => set("telegram", e.target.value)} /></Field>
            <Field label="Discord"><Input value={form.discord} onChange={(e) => set("discord", e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Total supply"><Input value={form.totalSupply} onChange={(e) => set("totalSupply", e.target.value)} /></Field>
            <Field label="Decimals"><Input value={form.decimals} onChange={(e) => set("decimals", e.target.value)} /></Field>
            <Field label={`Initial liquidity (${env.nativeSymbol})`}><Input value={form.initialLiquidity} onChange={(e) => set("initialLiquidity", e.target.value)} /></Field>
            <Field label="Creator allocation %"><Input value={form.creatorAllocation} onChange={(e) => set("creatorAllocation", e.target.value)} /></Field>
            <Field label="Staking allocation %"><Input value={form.stakingAllocation} onChange={(e) => set("stakingAllocation", e.target.value)} /></Field>
            <Field label="Reward allocation %"><Input value={form.rewardAllocation} onChange={(e) => set("rewardAllocation", e.target.value)} /></Field>
          </div>
          <Button disabled={!valid} onClick={() => setConfirm(true)}>Create Token</Button>
        </div>
      </div>
      <aside className="card sticky top-24 h-fit p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Live preview</p>
        <div className="mt-4 flex items-center gap-3">
          <TokenLogo symbol={preview.symbol || "SB"} size={56} />
          <div>
            <h2 className="font-display text-2xl">{preview.name || "Token Name"}</h2>
            <p className="text-muted">{preview.symbol || "SYMBOL"}</p>
          </div>
        </div>
        <dl className="mt-6 grid gap-3 text-sm">
          <Row label="Total supply" value={formatNumber(supply, false)} />
          <Row label="Initial liquidity" value={`${form.initialLiquidity} ${env.nativeSymbol}`} />
          <Row label="Creator allocation" value={formatNumber(creator, false)} />
          <Row label="Staking rewards" value={formatNumber(staking + rewards, false)} />
          <Row label="Remaining for liquidity / public" value={formatNumber(remaining, false)} />
        </dl>
      </aside>
      <Modal open={confirm} onOpenChange={setConfirm} title="Deployment summary" description="Review the token configuration before confirming the factory transaction in your wallet.">
        <dl className="grid gap-2 text-sm">
          <Row label="Name" value={form.name} />
          <Row label="Symbol" value={form.symbol} />
          <Row label="Supply" value={form.totalSupply} />
          <Row label="Decimals" value={form.decimals} />
          <Row label="Initial liquidity" value={`${form.initialLiquidity} ${env.nativeSymbol}`} />
          <Row label="Creator / staking / rewards" value={`${form.creatorAllocation}% / ${form.stakingAllocation}% / ${form.rewardAllocation}%`} />
          <Row label="Network" value={env.chainName} />
        </dl>
        <Button className="mt-5 w-full" onClick={deploy}>Create Token</Button>
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
