import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { EMOTION_COLOR, EMOTION_EMOJI, EMOTION_LABEL, type Emotion } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/teacher/roster")({ component: Page });

type Filter = "all" | "care" | "anonymous";

function Page() {
  const { classStudents, classLogs } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const today = new Date().toDateString();
  const moodMap = useMemo(() => {
    const m = new Map<string, Emotion>();
    classLogs
      .filter((l) => new Date(l.loggedAt).toDateString() === today)
      .forEach((l) => m.set(l.childId, l.primaryEmotion));
    return m;
  }, [classLogs, today]);

  const filtered = classStudents.filter((s) => {
    if (q && !(s.name + (s.anonymousCode ?? "")).toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === "anonymous") return s.isAnonymous;
    if (filter === "care") {
      const m = moodMap.get(s.id);
      return m === "sad" || m === "very_sad";
    }
    return true;
  });

  return (
    <PageContainer>
      <PageTitle
        title="학생 명단"
        description="동의받지 않은 학생은 익명 코드로 표시됩니다. 상세 신호는 보호자 동의 후에만 보여요."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["all", "care", "anonymous"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl border px-3 py-1.5 text-xs ${
              filter === f ? "border-primary bg-primary-soft text-foreground" : "border-border bg-card text-muted-foreground"
            }`}
          >
            {f === "all" ? "전체" : f === "care" ? "오늘 돌봄 필요" : "익명만"}
          </button>
        ))}
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="이름 또는 익명 코드 검색"
          className="ml-auto max-w-[220px]"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left">학생</th>
              <th className="px-4 py-2 text-left">오늘 마음</th>
              <th className="px-4 py-2 text-left">활동 횟수 (7일)</th>
              <th className="px-4 py-2 text-left">공개</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const m = moodMap.get(s.id) ?? "unknown";
              const weekCount = classLogs.filter((l) => l.childId === s.id).length;
              const display = s.isAnonymous ? s.anonymousCode ?? "익명" : s.name;
              return (
                <tr
                  key={s.id}
                  onClick={() => navigate({ to: "/teacher/roster/$studentId", params: { studentId: s.id } })}
                  className="cursor-pointer border-t border-border hover:bg-accent/50"
                >
                  <td className="px-4 py-3 font-medium">{display}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-sm"
                        style={{ background: `color-mix(in oklab, ${EMOTION_COLOR[m]} 35%, white)` }}
                      >
                        {EMOTION_EMOJI[m]}
                      </span>
                      <span className="text-xs text-muted-foreground">{EMOTION_LABEL[m]}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{weekCount}</td>
                  <td className="px-4 py-3 text-xs">
                    {s.isAnonymous ? (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">익명</span>
                    ) : (
                      <span className="rounded-full bg-[var(--color-accent-mint)]/30 px-2 py-0.5 text-[10px]">공개 동의</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">검색 결과가 없어요.</div>
        ) : null}
      </div>
    </PageContainer>
  );
}
