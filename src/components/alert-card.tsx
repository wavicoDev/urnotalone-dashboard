import type { AlertCategory, CrisisAlert } from "@/lib/mock-data";
import { ALERT_CATEGORY_LABEL } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function severityColor(s: 1 | 2 | 3) {
  return s === 3 ? "var(--alert-3)" : s === 2 ? "var(--alert-2)" : "var(--alert-1)";
}

export function SeverityBadge({ severity }: { severity: 1 | 2 | 3 }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
      style={{ backgroundColor: severityColor(severity) }}
    >
      Lv.{severity}
    </span>
  );
}

export function CategoryBadge({ category }: { category: AlertCategory }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
      {ALERT_CATEGORY_LABEL[category]}
    </span>
  );
}

export function AlertStripeCard({
  alert,
  childName,
  onClick,
  className,
  rightSlot,
}: {
  alert: CrisisAlert;
  childName?: string;
  onClick?: () => void;
  className?: string;
  rightSlot?: React.ReactNode;
}) {
  const ack = !!alert.acknowledgedAt;
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]",
        ack ? "opacity-70" : "",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: severityColor(alert.severity) }}
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <SeverityBadge severity={alert.severity} />
            <CategoryBadge category={alert.category} />
            {childName ? <span className="text-xs text-muted-foreground">· {childName}</span> : null}
            <span className="ml-auto text-[11px] text-muted-foreground">
              {new Date(alert.detectedAt).toLocaleString("ko", {
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="text-sm leading-relaxed text-foreground/90">{alert.alertMessage}</div>
          {ack ? (
            <div className="mt-2 text-[11px] text-muted-foreground">
              확인됨 · {new Date(alert.acknowledgedAt!).toLocaleDateString("ko")}
            </div>
          ) : null}
        </div>
        {rightSlot}
      </div>
    </div>
  );
}
