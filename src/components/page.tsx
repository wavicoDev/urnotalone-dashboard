import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn("flex-1 overflow-y-auto px-5 py-6 pb-24 md:px-8 md:pb-10", className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </main>
  );
}

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
