import { dataSource } from "@/services/data";

export function DataModeBanner() {
  if (!dataSource.notice) return null;
  return (
    <div className="border-b border-warning/20 bg-warning/8 px-4 py-2 text-center text-xs text-warning">
      {dataSource.notice}
    </div>
  );
}
