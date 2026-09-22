import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <div className={cn("card flex flex-col items-start gap-3 p-8", className)}>
      <div className="h-10 w-10 rounded-2xl bg-accent/10 ring-1 ring-accent/20" />
      <h3 className="font-display text-xl">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-muted">{body}</p>
      {action ? <Button onClick={action.onClick}>{action.label}</Button> : null}
    </div>
  );
}
