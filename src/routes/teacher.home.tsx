import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageContainer } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { EMOTION_COLOR, EMOTION_EMOJI, EMOTION_LABEL, type Emotion } from "@/lib/mock-data";
import { useMemo } from "react";
import { AlertStripeCard } from "@/components/alert-card";
import { ShieldCheck, AlertTriangle, Smile } from "lucide-react";

export const Route = createFileRoute("/teacher/home")({ component: Page });

function todayOf(loggedAt: string) {
  return new Date(loggedAt).toDateString();
}

function Page() {
  const { classStudents, classLogs, classAlerts } = useApp();
  const navigate = useNavigate();

  const today = new Date().toDateString();

  const todayMood = useMemo(() => {
    const map = new Map<string, Emotion>();
    classLogs
      .filter((l) => todayOf(l.loggedAt) === today)
      .forEach((l) => map.set(l.childId, l.primaryEmotion));
    return map;
  }, [classLogs, today]);

  const counts = useMemo(() => {
    const c: Record<Emotion, number> = {
      very_sad: 0, sad: 0, neutral: 0, happy: 0, very_happy: 0, unknown: 0,
    };
    classStudents.forEach((s) => {
      const m = todayMood.get(s.id) ?? "unknown";
      c[m] += 1;
    });
    return c;
  }, [classStudents, todayMood]);

  const careCount = counts.very_sad + counts.sad;

  const openAlerts = classAlerts.filter((a) => !a.acknowledgedAt);

  return (
    <PageContainer>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="오늘 등록" value={`${classStudents.length - counts.unknown}/${classStudents.length}`} tone="primary" icon={Smile} />
        <Stat label="돌봄 필요" value={String(careCount)} tone="warm" icon={AlertTriangle} />
        <Stat label="미확인 신호" value={String(openAlerts.length)} tone="mint" icon={ShieldCheck} />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">오늘의 학급 마음 지도</h2>
            <p className="text-xs text-muted-foreground">
              각 칸은 한 학생이에요. 동의받지 않은 학생은 익명 코드로 표시됩니다.
            </p>
          </div>
          <Link to="/teacher/roster" className="text-xs text-primary">명단 전체 →</Link>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {classStudents.map((s) => {
            const m = todayMood.get(s.id) ?? "unknown";
            const display = s.isAnonymous ? s.anonymousCode ?? "익명" : s.name;
            return (
              <button
                key={s.id}
                onClick={() => navigate({ to: "/teacher/roster/$studentId", params: { studentId: s.id } })}
                className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-2 text-center transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                title={EMOTION_LABEL[m]}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xl"
                  style={{ background: `color-mix(in oklab, ${EMOTION_COLOR[m]} 35%, white)` }}
                >
                  {EMOTION_EMOJI[m]}
                </span>
                <span className="text-[11px] font-medium leading-tight">{display}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">미확인 신호</h2>
        {openAlerts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-center text-xs text-muted-foreground">
            현재 학급 내 미확인 신호가 없어요.
          </div>
        ) : (
          <div className="space-y-3">
            {openAlerts.map((a) => {
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
      </section>
    </PageContainer>
  );
}

function Stat({
  label, value, tone, icon: Icon,
}: { label: string; value: string; tone: "primary" | "warm" | "mint"; icon: React.ComponentType<{ className?: string }> }) {
  const bg =
    tone === "primary" ? "bg-primary-soft text-primary"
    : tone === "warm" ? "bg-[var(--color-accent-warm)]/20 text-[var(--color-accent-warm)]"
    : "bg-[var(--color-accent-mint)]/30 text-[color:var(--color-accent-mint)]";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}
