import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { useMemo, useState } from "react";
import { EmotionTimelineChart, EmotionDistributionDonut } from "@/components/charts";
import { ACTIVITY_LABEL, EMOTION_EMOJI, EMOTION_LABEL } from "@/lib/mock-data";

export const Route = createFileRoute("/parent/timeline")({ component: Page });

const RANGES = [
  { value: 7, label: "7일" },
  { value: 30, label: "30일" },
  { value: 90, label: "90일" },
] as const;

function Page() {
  const { children, emotionLogs, alerts } = useApp();
  const child = children[0];
  const [days, setDays] = useState<number>(7);
  const [selected, setSelected] = useState<string | null>(null);

  const logs = useMemo(
    () => emotionLogs.filter((l) => l.childId === child.id),
    [emotionLogs, child],
  );

  const filtered = useMemo(() => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return logs.filter((l) => new Date(l.loggedAt) >= since);
  }, [logs, days]);

  const crisisDays = useMemo(
    () => alerts.map((a) => {
      const d = new Date(a.detectedAt);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }),
    [alerts],
  );

  const dayList = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((l) => {
      const k = new Date(l.loggedAt).toDateString();
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(l);
    });
    return [...map.entries()].sort((a, b) => +new Date(b[0]) - +new Date(a[0]));
  }, [filtered]);

  const selectedLogs = selected ? dayList.find(([k]) => k === selected)?.[1] ?? [] : [];

  return (
    <PageContainer>
      <PageTitle
        title="감정 타임라인"
        description={`${child.name}이가 도리와 함께한 감정의 흐름이에요. 대화 원문은 보호됩니다.`}
        action={
          <div className="inline-flex rounded-xl bg-secondary p-1 text-xs">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setDays(r.value)}
                className={`rounded-lg px-3 py-1.5 font-medium ${days === r.value ? "bg-card shadow-sm" : "text-muted-foreground"}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="mb-3 text-xs text-muted-foreground">평균 감정 (1=많이 슬픔 ~ 5=아주 기쁨)</div>
          <EmotionTimelineChart logs={filtered} days={days} crisisDays={crisisDays} height={280} />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 text-xs text-muted-foreground">감정 분포</div>
          <EmotionDistributionDonut logs={filtered} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 text-sm font-semibold">일별 활동</div>
          <div className="space-y-1.5">
            {dayList.length === 0 ? (
              <div className="rounded-lg bg-secondary/50 p-4 text-center text-xs text-muted-foreground">
                선택한 기간에 활동이 없어요.
              </div>
            ) : null}
            {dayList.map(([k, list]) => {
              const top = list[0];
              const date = new Date(k);
              const active = selected === k;
              return (
                <button
                  key={k}
                  onClick={() => setSelected(k)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    active ? "border-primary bg-primary-soft" : "border-transparent hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{EMOTION_EMOJI[top.primaryEmotion]}</span>
                    <div>
                      <div className="text-xs font-medium">
                        {date.toLocaleDateString("ko", { month: "long", day: "numeric", weekday: "short" })}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {list.length}건 · {ACTIVITY_LABEL[top.activityType]} 외
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{EMOTION_LABEL[top.primaryEmotion]}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 text-sm font-semibold">
            {selected ? new Date(selected).toLocaleDateString("ko", { month: "long", day: "numeric" }) + "의 활동" : "활동을 선택해 주세요"}
          </div>
          {selectedLogs.length === 0 ? (
            <div className="rounded-lg bg-secondary/50 p-4 text-xs text-muted-foreground">
              왼쪽에서 일자를 선택하면 그날의 활동 카테고리와 수위가 보여요. 대화 원문은 표시되지 않습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedLogs.map((l) => (
                <div key={l.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{EMOTION_EMOJI[l.primaryEmotion]}</span>
                      <span className="font-medium">{ACTIVITY_LABEL[l.activityType]}</span>
                      {l.category ? <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{l.category}</span> : null}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(l.loggedAt).toLocaleTimeString("ko", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {l.emotionWords.length ? (
                    <div className="mt-1.5 text-[11px] text-muted-foreground">
                      감정 단어: {l.emotionWords.map((w) => `‘${w}’`).join(", ")}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
