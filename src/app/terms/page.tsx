export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-4xl">Terms</h1>
      <p className="text-sm leading-7 text-muted">
        StakeBro provides software for interacting with public blockchain networks. You are responsible for wallet security,
        transaction review, and compliance with applicable law. Tokens can lose value. Staking rewards are not guaranteed
        profits and depend on contract configuration and emissions.
      </p>
      <p className="text-sm leading-7 text-muted">
        StakeBro does not custody user assets and does not guarantee uptime of third-party RPCs, wallets, or liquidity venues.
      </p>
    </article>
  );
}
