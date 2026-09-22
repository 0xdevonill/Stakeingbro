"use client";

import { useAccount } from "wagmi";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { hasTokenFactory, isMockMode } from "@/config/env";
import { env } from "@/config/env";
import { useSimulation } from "@/hooks/useSimulation";
import { formatBps, formatNumber, formatUsd } from "@/lib/format";
import { errorMessage } from "@/lib/errors";
import { dataSource } from "@/services/data";
import type { TokenRecord } from "@/types";

export function TradeWidget({ token }: { token: TokenRecord }) {
  const { address, isConnected } = useAccount();
  const { applyTrade, holdings } = useSimulation();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("0.00");
  const [confirm, setConfirm] = useState(false);
  const numeric = Number(amount) || 0;
  const quote = useMemo(() => dataSource.quote(token, numeric, side), [token, numeric, side]);
  const tokenBalance = holdings[token.address] ?? 0;

  function submit() {
    if (!isConnected || !address) {
      toast.error(errorMessage("NOT_CONNECTED").title, { description: errorMessage("NOT_CONNECTED").body });
      return;
    }
    if (!hasTokenFactory && !isMockMode) {
      toast.error(errorMessage("CONTRACT_UNAVAILABLE").title, { description: errorMessage("CONTRACT_UNAVAILABLE").body });
      return;
    }
    const received = side === "buy" ? quote.amountOut : quote.amountOut;
    applyTrade(side, token.address, side === "buy" ? quote.amountOut : numeric, token.symbol, address);
    setConfirm(false);
    toast.success(isMockMode ? "Simulated in development mode" : "Transaction submitted", {
      description: isMockMode
        ? "No blockchain transaction was sent. This updated local development state only."
        : `Wallet confirmation is required for the ${side} on Robinhood Chain.`,
    });
    void received;
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="grid grid-cols-2 rounded-full bg-surface-2 p-1">
        {(["buy", "sell"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setSide(item)}
            className={`rounded-full py-2 text-sm capitalize ${side === item ? (item === "buy" ? "bg-accent text-[#05261b]" : "bg-danger text-white") : ""}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-2xl bg-surface-2 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">You Pay</p>
        <div className="mt-2 flex items-center gap-3">
          <Input value={amount} onChange={(event) => setAmount(event.target.value)} className="border-0 bg-transparent px-0 text-2xl" />
          <span className="rounded-full bg-background px-3 py-1 text-sm">{side === "buy" ? env.nativeSymbol : token.symbol}</span>
        </div>
        <p className="mt-1 text-xs text-muted">
          Balance: {side === "buy" ? "wallet ETH" : formatNumber(tokenBalance)} {side === "buy" ? env.nativeSymbol : token.symbol}
        </p>
      </div>
      <div className="my-3 text-center text-muted">↓</div>
      <div className="rounded-2xl bg-surface-2 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">You Receive</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl">{formatNumber(quote.amountOut)}</p>
          <span className="rounded-full bg-background px-3 py-1 text-sm">{side === "buy" ? token.symbol : env.nativeSymbol}</span>
        </div>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-muted">
        <div className="flex justify-between">
          <dt>Price impact</dt>
          <dd>{quote.priceImpact.toFixed(2)}%</dd>
        </div>
        <div className="flex justify-between">
          <dt>Minimum received</dt>
          <dd>{formatNumber(quote.minimumReceived)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Network fee</dt>
          <dd>~{quote.networkFeeEth} {env.nativeSymbol}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Platform fee</dt>
          <dd>{formatUsd(quote.platformFee)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Trading fee</dt>
          <dd>{formatBps(token.fees.tradingFeeBps)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-4 text-warning">
        {quote.source === "development-model"
          ? "Estimated quote from the development pricing model — not a live Uniswap quote."
          : "Quote from Uniswap on Robinhood Chain."}
      </p>
      <Button className="mt-4 w-full" variant={side === "sell" ? "danger" : "primary"} onClick={() => setConfirm(true)}>
        {side === "buy" ? `Buy ${token.symbol}` : `Sell ${token.symbol}`}
      </Button>
      <Modal
        open={confirm}
        onOpenChange={setConfirm}
        title={side === "buy" ? `Buy ${token.symbol}` : `Sell ${token.symbol}`}
        description="Review the quote before confirming in your wallet. StakeBro never asks for a private key."
      >
        <dl className="grid gap-2 text-sm">
          <Row label="Token amount" value={`${formatNumber(side === "buy" ? quote.amountOut : numeric)} ${token.symbol}`} />
          <Row label="Estimated received" value={`${formatNumber(side === "buy" ? quote.amountOut : quote.amountOut)} ${side === "buy" ? token.symbol : env.nativeSymbol}`} />
          <Row label="Price impact" value={`${quote.priceImpact.toFixed(2)}%`} />
          <Row label="Slippage" value={`${quote.slippageBps / 100}%`} />
          <Row label="Network fee" value={`~${quote.networkFeeEth} ${env.nativeSymbol}`} />
          <Row label="Platform fee" value={formatUsd(quote.platformFee)} />
          <Row label="Minimum received" value={formatNumber(quote.minimumReceived)} />
        </dl>
        <Button className="mt-5 w-full" onClick={submit}>
          Confirm in wallet
        </Button>
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
