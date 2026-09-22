import Link from "next/link";

const sections = [
  {
    id: "what",
    title: "What is StakeBro?",
    body: "StakeBro is a token launch, discovery, trading, and staking interface for the Robinhood network. Users can discover tokens, purchase tokens, stake, earn rewards, claim or compound those rewards, and review public holder and creator information.",
  },
  {
    id: "launch",
    title: "How token launching works",
    body: "Creators submit name, symbol, supply, allocations, and liquidity parameters. When a token factory contract is configured, StakeBro sends a wallet-confirmed transaction to that factory. Until then, the launch form is wired but will not invent an on-chain deployment.",
  },
  {
    id: "buying",
    title: "How buying works",
    body: "Buys are quoted against the configured liquidity venue on Robinhood Chain. Uniswap is the public DEX on this network. Quotes show price impact, minimum received, network fee, platform fee, and trading fee before wallet confirmation.",
  },
  {
    id: "staking",
    title: "How staking works",
    body: "Compatible tokens expose one or more pools. Flexible pools can be unstaked anytime. Timed pools may require a lock. Stake, unstake, claim, and compound each require a wallet signature when the staking contract is configured.",
  },
  {
    id: "rewards",
    title: "How rewards work",
    body: "The staking contract calculates rewards from amount staked, duration, reward emission rate, and pool configuration. APR and reward rates can change. Rewards are not guaranteed profits.",
  },
  {
    id: "claiming",
    title: "How claiming works",
    body: "Claiming withdraws pending rewards to your wallet. You will see the available amount, estimated network fee, and the amount you receive before confirming.",
  },
  {
    id: "compounding",
    title: "How compounding works",
    body: "Compounding adds pending rewards to your existing stake through the staking contract, increasing the position instead of sending rewards to your wallet.",
  },
  {
    id: "unstaking",
    title: "How unstaking works",
    body: "Unstaking returns staked tokens to your wallet, subject to any lock period or penalty defined by the pool. If there is no lock, StakeBro displays Flexible — Unstake Anytime.",
  },
  {
    id: "fees",
    title: "Fees",
    body: "Creator fee, platform fee, trading fee, and network (ETH) gas are shown in the interface. Live values should be read from the configured contracts rather than assumed.",
  },
  {
    id: "contracts",
    title: "Smart contracts",
    body: "StakeBro separates the frontend, token factory, staking contracts, Uniswap liquidity/trading integration, and an indexing layer. Contract addresses are supplied through environment variables. Independently audit contracts before they handle meaningful funds.",
  },
  {
    id: "security",
    title: "Security",
    body: "StakeBro never asks for or stores private keys or seed phrases. Listing a token is not a safety guarantee. Review verification status, mint/freeze authority, liquidity, and the explorer listing before transacting.",
  },
];

const faqs = [
  ["What is StakeBro?", "A Robinhood Chain interface for launching, discovering, trading, and staking tokens."],
  ["How do I buy a token?", "Open the token page, enter the amount of ETH you want to spend, review fees and price impact, then confirm the swap in your wallet."],
  ["How does staking work?", "Choose a pool, approve the token if required, then stake. Rewards accrue according to the staking contract."],
  ["When can I claim rewards?", "Whenever the contract reports a pending reward balance. Claim is a wallet-confirmed transaction."],
  ["Can I compound my rewards?", "Yes, if the pool supports compounding. Pending rewards are added to your stake."],
  ["Can I unstake anytime?", "Only in flexible pools. Locked pools show remaining lock time."],
  ["What are the fees?", "Creator, platform, trading, and network fees are listed on each token page and in the trade confirmation."],
  ["Where can I verify a token contract?", "Use the Robinhood Chain explorer linked from the token page."],
  ["Where can I view my transaction?", "After confirmation, StakeBro links the transaction hash on the explorer."],
  ["What happens if a staking pool ends?", "New stakes stop and remaining rewards follow the contract configuration. Unstaking depends on that pool’s lock rules."],
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Documentation</p>
        <h1 className="font-display mt-2 text-4xl">StakeBro docs</h1>
      </div>
      <nav className="card grid gap-2 p-4 text-sm">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`} className="hover:text-accent">
            {section.title}
          </a>
        ))}
        <a href="#faq" className="hover:text-accent">FAQ</a>
      </nav>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="space-y-3">
          <h2 className="font-display text-2xl">{section.title}</h2>
          <p className="text-sm leading-7 text-muted">{section.body}</p>
        </section>
      ))}
      <section id="faq" className="space-y-4">
        <h2 className="font-display text-2xl">FAQ</h2>
        {faqs.map(([question, answer]) => (
          <div key={question} className="card p-4">
            <h3 className="font-medium">{question}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{answer}</p>
          </div>
        ))}
      </section>
      <p className="text-sm text-muted">
        Need the product? <Link href="/explore" className="text-accent">Explore tokens</Link>
      </p>
    </div>
  );
}
