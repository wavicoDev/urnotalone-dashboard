import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageContainer } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { EMOTION_EMOJI, EMOTION_LABEL, ACTIVITY_LABEL } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquareHeart, LineChart } from "lucide-react";
import { EmotionTimelineChart } from "@/components/charts";
import { useMemo } from "react";
import { AlertStripeCard } from "@/components/alert-card";

export const Route = createFileRoute("/parent/home")({ component: Page });

function Page() {
  const { children, emotionLogs, alerts, milestones, coaching } = useApp();
  const child = children[0];
  const navigate = useNavigate();

  const childLogs = useMemo(() => emotionLogs.filter((l) => l.childId === child.id), [emotionLogs, child]);
  const todayLog = useMemo(() => {
    const t = new Date();
    return childLogs
      .filter((l) => new Date(l.loggedAt).toDateString() === t.toDateString())
      .sort((a, b) => +new Date(b.loggedAt) - +new Date(a.loggedAt))[0];
  }, [childLogs]);

  const recentAlert = alerts.find((a) => a.childId === child.id);
  const week = coaching[0];

  return (
    <PageContainer>
      <section className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <div className="flex flex-col items-center text-center">
          <div className="text-[110px] leading-none">{EMOTION_EMOJI[todayLog?.primaryEmotion ?? "unknown"]}</div>
          <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">오늘의 마음</div>
          <h2 className="mt-1 text-2xl font-bold">
            {child.name}이는 오늘 <span className="text-primary">{EMOTION_LABEL[todayLog?.primaryEmotion ?? "unknown"]}</span>
          </h2>
          {todayLog ? (
            <div className="mt-2 text-sm text-muted-foreground">
              도리와 함께한 활동 · <strong className="text-foreground">{ACTIVITY_LABEL[todayLog.activityType]}</strong>
            </div>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">아직 오늘의 신호가 없어요</div>
          )}

          <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/80">
            {recentAlert
              ? "오늘 저녁, 평가하지 말고 자연스럽게 이야기 나눠 주세요. 평소처럼 함께 있어 주는 것만으로 충분해요."
              : "오늘은 평온한 하루였어요. 잠들기 전 짧은 칭찬 한 마디면 도리도 함께 기뻐할 거예요."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Button className="rounded-xl" onClick={() => navigate({ to: "/parent/timeline" })}>
              <LineChart className="mr-1.5 h-4 w-4" /> 감정 타임라인 보기
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => navigate({ to: "/parent/coaching" })}>
              <MessageSquareHeart className="mr-1.5 h-4 w-4" /> 코칭 카드 보기
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-2 text-xs text-muted-foreground">이번 주 감정 흐름</div>
          <EmotionTimelineChart logs={childLogs} days={7} height={140} crisisDays={alerts.map((a) => {
            const d = new Date(a.detectedAt);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          })} />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-2 text-xs text-muted-foreground">마일스톤</div>
          <div className="text-3xl font-bold">{milestones.length}</div>
          <div className="mt-1 text-xs text-muted-foreground">최근 30일 달성 배지</div>
          {milestones[0] ? <div className="mt-3 rounded-lg bg-primary-soft p-2 text-xs">🏅 {milestones[0].label}</div> : null}
          <Link to="/parent/growth" className="mt-3 inline-flex items-center text-xs text-primary">
            전체 보기 <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-2 text-xs text-muted-foreground">최근 알림</div>
          {recentAlert ? (
            <AlertStripeCard
              alert={recentAlert}
              onClick={() => navigate({ to: "/parent/alerts/$alertId", params: { alertId: recentAlert.id } })}
              className="!border-0 !p-0"
            />
          ) : (
            <div className="text-xs text-muted-foreground">최근 위기 신호가 없어요.</div>
          )}
        </div>
      </div>

      {week ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">이번 주 코칭 카드</div>
          <h3 className="text-lg font-semibold">{week.headline}</h3>
          <p className="mt-2 text-sm text-foreground/80">{week.insight}</p>
        </div>
      ) : null}
    </PageContainer>
  );
}
