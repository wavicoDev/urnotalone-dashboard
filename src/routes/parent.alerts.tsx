import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { AlertStripeCard } from "@/components/alert-card";
import { EmptyState } from "@/components/empty-state";
import { useState } from "react";

export const Route = createFileRoute("/parent/alerts")({ component: Page });

const FILTERS = [
  { value: "all", label: "전체" },
  { value: "2", label: "Lv.2" },
  { value: "3", label: "Lv.3" },
] as const;

function Page() {
  const { alerts, children } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");

  const list = alerts
    .filter((a) => (filter === "all" ? true : String(a.severity) === filter))
    .sort((a, b) => +new Date(b.detectedAt) - +new Date(a.detectedAt));

  return (
    <PageContainer>
      <PageTitle
        title="위기 알림 센터"
        description="추상화된 본문으로만 안내됩니다. 자세한 대화 내용은 보호돼요."
        action={
          <div className="inline-flex rounded-xl bg-secondary p-1 text-xs">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-lg px-3 py-1.5 ${filter === f.value ? "bg-card shadow-sm" : "text-muted-foreground"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />

      {list.length === 0 ? (
        <EmptyState title="알림이 없어요" description="평온한 시간을 보내고 있어요." />
      ) : (
        <div className="space-y-3">
          {list.map((a) => {
            const child = children.find((c) => c.id === a.childId);
            return (
              <AlertStripeCard
                key={a.id}
                alert={a}
                childName={child?.name}
                onClick={() => navigate({ to: "/parent/alerts/$alertId", params: { alertId: a.id } })}
              />
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
