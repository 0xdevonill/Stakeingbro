import Link from "next/link";
import { StakeBroLogo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/explore", label: "Explore" },
      { href: "/launch", label: "Launch Token" },
      { href: "/staking", label: "Staking" },
      { href: "/analytics", label: "Analytics" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/security", label: "Security" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: siteConfig.social.x, label: "X", external: true },
      { href: siteConfig.social.discord, label: "Discord", external: true },
      { href: siteConfig.social.telegram, label: "Telegram", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border pb-24 lg:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <StakeBroLogo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            Discover tokens on the Robinhood network, trade with confidence, and put your tokens to work.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{column.title}</p>
            <div className="mt-4 grid gap-2">
              {column.links.map((link) =>
                "external" in link && link.external ? (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="text-sm text-foreground/80 hover:text-accent">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className="text-sm text-foreground/80 hover:text-accent">
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-4 text-xs text-muted">
        StakeBro does not custody funds. Listing on StakeBro is not a safety guarantee.
      </div>
    </footer>
  );
}
