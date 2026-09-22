export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-4xl">Privacy</h1>
      <p className="text-sm leading-7 text-muted">
        StakeBro does not collect seed phrases or private keys. Wallet addresses you connect are public blockchain identifiers.
        Watchlist and local simulation state stay in your browser. If you later connect an indexer or analytics provider,
        only public chain data should be stored there.
      </p>
    </article>
  );
}
