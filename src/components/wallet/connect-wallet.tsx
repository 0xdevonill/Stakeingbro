"use client";

import { formatEther } from "viem";
import { useAccount, useBalance, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { Check, ChevronDown, Copy, ExternalLink, LogOut, UserRound, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { robinhoodChain, robinhoodTestnet, explorerAddress } from "@/config/chain";
import { configuredChain } from "@/config/chain";
import { env } from "@/config/env";
import { formatNumber, formatTokenAmount } from "@/lib/format";
import { copyText, shortAddress } from "@/lib/utils";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const balance = useBalance({ address });
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrongNetwork = isConnected && chainId !== configuredChain.id;

  if (isConnected && address) {
    return (
      <div className="relative">
        {wrongNetwork ? (
          <Button
            size="sm"
            variant="danger"
            onClick={() => switchChain({ chainId: configuredChain.id })}
          >
            Switch network
          </Button>
        ) : (
          <button
            onClick={() => setMenu((value) => !value)}
            className="glass flex h-11 items-center gap-2 rounded-full px-3"
          >
            <span className="hidden text-xs text-muted sm:inline">{formatTokenAmount(Number(balance.data ? formatEther(balance.data.value) : 0), env.nativeSymbol)}</span>
            <span className="rounded-full bg-surface-3 px-2.5 py-1 font-mono text-xs">{shortAddress(address)}</span>
            <ChevronDown size={14} className="text-muted" />
          </button>
        )}
        {menu ? (
          <div className="card absolute right-0 z-40 mt-2 w-72 p-3">
            <p className="px-2 text-[11px] uppercase tracking-[0.16em] text-muted">Wallet</p>
            <p className="mt-1 px-2 font-mono text-sm">{shortAddress(address, 6)}</p>
            <div className="mt-3 grid gap-1">
              <button
                className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-white/5"
                onClick={async () => {
                  await copyText(address);
                  setCopied(true);
                  toast.success("Address copied");
                  setTimeout(() => setCopied(false), 1200);
                }}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />} Copy address
              </button>
              <a
                className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-white/5"
                href={explorerAddress(address)}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={15} /> View explorer
              </a>
              <Link href="/portfolio" className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-white/5" onClick={() => setMenu(false)}>
                <UserRound size={15} /> My Portfolio
              </Link>
              <button
                className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-danger hover:bg-white/5"
                onClick={() => {
                  disconnect();
                  setMenu(false);
                }}
              >
                <LogOut size={15} /> Disconnect
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Wallet size={16} /> Connect Wallet
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Connect Wallet"
        description="StakeBro never asks for your private key or seed phrase. Connecting only shares your public address."
      >
        <div className="grid gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector, chainId: configuredChain.id })}
              className="flex h-12 items-center justify-between rounded-2xl border border-border px-4 text-sm hover:bg-white/5"
              disabled={isPending}
            >
              {connector.name}
              <span className="text-xs text-muted">{isPending ? "Connecting…" : "Connect"}</span>
            </button>
          ))}
        </div>
        {error ? <p className="mt-3 text-sm text-danger">{error.message}</p> : null}
      </Modal>
    </>
  );
}

export function NetworkSelector() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const current = [robinhoodChain, robinhoodTestnet].find((chain) => chain.id === chainId) ?? configuredChain;

  return (
    <div className="relative hidden md:block">
      <button onClick={() => setOpen((value) => !value)} className="glass flex h-11 items-center gap-2 rounded-full px-3 text-sm">
        <span className="h-2 w-2 rounded-full bg-accent" />
        {current.name.replace(" Chain", "")}
        <ChevronDown size={14} className="text-muted" />
      </button>
      {open ? (
        <div className="card absolute right-0 z-40 mt-2 w-64 p-2">
          {[robinhoodChain, robinhoodTestnet].map((chain) => (
            <button
              key={chain.id}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-white/5"
              onClick={() => {
                if (isConnected) switchChain({ chainId: chain.id });
                setOpen(false);
              }}
            >
              {chain.name}
              {chain.id === chainId ? <Check size={14} className="text-accent" /> : null}
            </button>
          ))}
          <p className="px-3 pt-2 text-[11px] leading-4 text-muted">
            Chain ID {formatNumber(current.id, false)}. Native gas token is ETH.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function WrongNetworkGate() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const wrong = isConnected && chainId !== configuredChain.id;
  if (!wrong) return null;
  return (
    <Modal open onOpenChange={() => undefined} title="Wrong Network" description="Please switch to the Robinhood network to continue.">
      <Button onClick={() => switchChain({ chainId: configuredChain.id })}>Switch Network</Button>
    </Modal>
  );
}
