export default function SecurityPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-4xl">Security</h1>
      <p className="text-muted">
        StakeBro is a non-custodial interface. It never asks for, stores, or transmits private keys or seed phrases.
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
        <li>Wallet connection only exposes a public address.</li>
        <li>Every on-chain action requires confirmation in your wallet.</li>
        <li>Contract addresses, RPCs, and explorer URLs come from configuration.</li>
        <li>A listing on StakeBro is not a safety rating.</li>
        <li>Smart contracts should be independently audited before handling meaningful funds.</li>
        <li>There is no hidden admin backdoor. Admin views require an allowlisted connected wallet.</li>
      </ul>
    </article>
  );
}
