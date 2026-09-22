import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-lg p-10 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">404</p>
      <h1 className="font-display mt-2 text-3xl">Page not found</h1>
      <p className="mt-3 text-sm text-muted">That route is not part of StakeBro. Head back to explore tokens or staking.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild><Link href="/explore">Explore Tokens</Link></Button>
        <Button asChild variant="secondary"><Link href="/">Home</Link></Button>
      </div>
    </div>
  );
}
