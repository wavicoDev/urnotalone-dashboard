import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { MiniSparkline } from "@/components/charts";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/parent/growth")({ component: Page });

function Page() {
  const { children, milestones, emotionLogs } = useApp();
  const child = children[0];

  // Unique emotion vocabulary count over time
  const childLogs = emotionLogs.filter((l) => l.childId === child.id);
  const allWords = new Set(childLogs.flatMap((l) => l.emotionWords));

  // gratitude streak
  const gratitudeDays = new Set(
    childLogs
      .filter((l) => l.activityType === "gratitude_journal" && l.completed)
      .map((l) => new Date(l.loggedAt).toDateString()),
  );

  const restructuring = childLogs.filter((l) => l.activityType === "cognitive_restructuring").length;

  const metrics = [
    { label: "감정 단어", value: allWords.size, diff: "+3", spark: [10, 12, 14, 14, 18, 21, 24, allWords.size] },
    { label: "감사 일기 연속", value: gratitudeDays.size, diff: "+1", spark: [3, 4, 5, 5, 6, 6, 7, gratitudeDays.size] },
    { label: "인지 재구성 시도", value: restructuring, diff: "+2", spark: [0, 1, 1, 2, 2, 3, 4, restructuring] },
  ];

  return (
    <PageContainer>
      <PageTitle title="성장 마일스톤" description={`${child.name}이의 작은 성장들을 모았어요.`} />

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="text-xs text-muted-foreground">{m.label}</div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-4xl font-bold">{m.value}</div>
              <div className="mb-1 rounded-full bg-[var(--color-accent-mint)]/30 px-2 py-0.5 text-[10px] font-medium">
                {m.diff} 지난주
              </div>
            </div>
            <div className="mt-2">
              <MiniSparkline values={m.spark} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold">달성 배지</h2>
        <div className="space-y-3">
          {milestones.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-warm)]/20 text-[var(--color-accent-warm)]">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-[11px] text-muted-foreground">
                  {new Date(m.achievedAt).toLocaleDateString("ko", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
