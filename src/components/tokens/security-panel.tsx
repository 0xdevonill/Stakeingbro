import { Badge } from "@/components/ui/badge";
import { explorerAddress, explorerToken } from "@/config/chain";
import { formatBps } from "@/lib/format";
import { shortAddress } from "@/lib/utils";
import type { TokenRecord } from "@/types";

export function SecurityPanel({ token }: { token: TokenRecord }) {
  const flags = [
    token.permissions.mintAuthority && "This token still has mint authority.",
    token.permissions.freezeAuthority && "Freeze authority is enabled.",
    token.permissions.pausable && "The contract can be paused.",
    !token.permissions.ownerRenounced && "An owner address is still set.",
    token.verified !== "verified" && "Contract is not marked verified.",
    token.liquidityUsd < 100_000 && "Liquidity is relatively low.",
  ].filter(Boolean) as string[];

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Contract information</p>
          <h3 className="font-display mt-1 text-xl">Security details</h3>
        </div>
        <Badge tone={flags.length ? "warning" : "accent"}>{flags.length ? "Review flags" : "Standard permissions"}</Badge>
      </div>
      <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">
        <Item label="Contract" value={shortAddress(token.address, 6)} href={explorerToken(token.address)} />
        <Item label="Network" value={token.network} />
        <Item label="Verification" value={token.verified} />
        <Item label="Liquidity" value={`$${Math.round(token.liquidityUsd).toLocaleString()}`} />
        <Item label="Owner" value={token.permissions.ownerRenounced ? "Renounced" : shortAddress(token.permissions.owner ?? "")} href={token.permissions.owner ? explorerAddress(token.permissions.owner) : undefined} />
        <Item label="Mint authority" value={token.permissions.mintAuthority ? "Enabled" : "Disabled"} />
        <Item label="Freeze authority" value={token.permissions.freezeAuthority ? "Enabled" : "Disabled"} />
        <Item label="Pausable" value={token.permissions.pausable ? "Yes" : "No"} />
        <Item label="Total supply" value={token.totalSupply.toLocaleString()} />
        <Item label="Circulating supply" value={token.circulatingSupply.toLocaleString()} />
      </dl>
      <div className="mt-5 rounded-2xl bg-surface-2 p-4">
        <p className="text-sm font-medium">Fee breakdown</p>
        <div className="mt-3 grid gap-2 text-sm">
          <div className="flex justify-between"><span className="text-muted">Creator fee</span><span>{formatBps(token.fees.creatorFeeBps)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Platform fee</span><span>{formatBps(token.fees.platformFeeBps)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Trading fee</span><span>{formatBps(token.fees.tradingFeeBps)}</span></div>
        </div>
      </div>
      {flags.length ? (
        <ul className="mt-4 grid gap-2 text-sm text-warning">
          {flags.map((flag) => (
            <li key={flag}>{flag}</li>
          ))}
        </ul>
      ) : null}
      <p className="mt-4 text-xs leading-5 text-muted">
        StakeBro does not claim a token is safe merely because it is listed here. Review the contract on the explorer before transacting.
      </p>
    </div>
  );
}

function Item({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="mt-1">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-accent">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
