export const siteConfig = {
  name: "StakeBro",
  tagline: "Launch. Trade. Stake. Earn.",
  description:
    "Discover tokens on the Robinhood network, trade with confidence, and put your tokens to work through StakeBro staking.",
  url: "https://stakebro.app",
  social: {
    x: "https://x.com/stakebro",
    discord: "https://discord.gg/stakebro",
    telegram: "https://t.me/stakebro",
  },
} as const;

export const navItems = [
  { href: "/explore", label: "Explore" },
  { href: "/launch", label: "Launch Token" },
  { href: "/staking", label: "Staking" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/docs", label: "Documentation" },
] as const;

export const mobileNavItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/explore", label: "Explore", icon: "compass" },
  { href: "/staking", label: "Stake", icon: "coins" },
  { href: "/launch", label: "Launch", icon: "rocket" },
  { href: "/portfolio", label: "Portfolio", icon: "wallet" },
] as const;
