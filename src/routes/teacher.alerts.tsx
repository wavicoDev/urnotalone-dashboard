import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { AlertStripeCard } from "@/components/alert-card";
import { useState } from "react";

export const Route = createFileRoute("/teacher/alerts")({ component: Page });

function Page() {
  const { classAlerts, classStudents } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"open" | "all">("open");

  const list = classAlerts
    .filter((a) => (tab === "open" ? !a.acknowledgedAt : true))
    .sort((a, b) => +new Date(b.detectedAt) - +new Date(a.detectedAt));

  return (
    <PageContainer>
      <PageTitle
        title="학급 신호 알림"
        description="추상화된 본문으로만 안내됩니다. 후속 조치 기록을 남겨주세요."
        action={
          <div className="inline-flex rounded-xl bg-secondary p-1 text-xs">
            {(["open", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-3 py-1.5 ${tab === t ? "bg-card shadow-sm" : "text-muted-foreground"}`}
              >
                {t === "open" ? "미확인" : "전체"}
              </button>
            ))}
          </div>
        }
      />
      {list.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
          신호가 없어요.
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((a) => {
            const child = classStudents.find((c) => c.id === a.childId);
            const name = child?.isAnonymous ? child.anonymousCode : child?.name;
            return (
              <AlertStripeCard
                key={a.id}
                alert={a}
                childName={name}
                onClick={() => navigate({ to: "/teacher/alerts/$alertId", params: { alertId: a.id } })}
              />
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
