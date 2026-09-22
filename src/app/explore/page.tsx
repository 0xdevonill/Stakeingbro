import { Suspense } from "react";
import ExplorePage from "./explore-client";
import { TableSkeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ExplorePage />
    </Suspense>
  );
}
