import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageContainer } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { EmotionTimelineChart } from "@/components/charts";
import { ACTIVITY_LABEL } from "@/lib/mock-data";
import { ArrowLeft, EyeOff, Lock, NotebookPen } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/roster/$studentId")({ component: Page });

function Page() {
  const { studentId } = useParams({ from: "/teacher/roster/$studentId" });
  const { classStudents, classLogs, emotionLogs, teacherNotes, addTeacherNote, classAlerts } = useApp();
  const student = classStudents.find((s) => s.id === studentId);
  const [note, setNote] = useState("");

  if (!student) return <PageContainer>학생을 찾을 수 없어요.</PageContainer>;

  // If anonymous → restricted view
  if (student.isAnonymous) {
    return (
      <PageContainer>
        <BackLink />
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">{student.anonymousCode}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            보호자가 신호 상세 공개에 동의하지 않은 학생입니다.
            학급 통계에는 익명으로 포함되며, 개별 신호와 활동은 표시되지 않아요.
          </p>
          <div className="mx-auto mt-4 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">
            <EyeOff className="h-3 w-3" /> 익명 모드
          </div>
        </div>
      </PageContainer>
    );
  }

  const logs = (student.id === "child_sumin" ? emotionLogs : classLogs).filter((l) => l.childId === student.id);
  const alerts = classAlerts.filter((a) => a.childId === student.id);
  const notes = teacherNotes.filter((n) => n.childId === student.id);

  return (
    <PageContainer>
      <BackLink />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-bold">{student.name}</h2>
          <span className="text-xs text-muted-foreground">초{student.gradeLevel}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          최근 7일 학급 활동 흐름이에요. 대화 원문은 보호됩니다.
        </p>
        <div className="mt-4">
          <EmotionTimelineChart logs={logs} days={7} height={200} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold">최근 신호</h3>
          {alerts.length === 0 ? (
            <div className="text-xs text-muted-foreground">최근 신호 없음.</div>
          ) : (
            <div className="space-y-2">
              {alerts.map((a) => (
                <Link
                  key={a.id}
                  to="/teacher/alerts/$alertId"
                  params={{ alertId: a.id }}
                  className="block rounded-xl border border-border p-3 hover:bg-accent"
                >
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(a.detectedAt).toLocaleString("ko")}
                  </div>
                  <div className="mt-1 text-sm">{a.alertMessage}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <NotebookPen className="h-4 w-4" /> 교사 메모
          </h3>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="관찰한 내용이나 학교 내 대응을 기록하세요."
          />
          <div className="mt-2 flex justify-end">
            <Button
              size="sm"
              className="rounded-xl"
              disabled={!note.trim()}
              onClick={() => {
                addTeacherNote(student.id, note.trim());
                setNote("");
                toast.success("메모를 저장했어요.");
              }}
            >
              저장
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            {notes.map((n) => (
              <div key={n.id} className="rounded-xl bg-secondary/40 p-2 text-xs">
                <div className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleString("ko")}</div>
                <div>{n.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">최근 활동 (요약)</h3>
        <div className="space-y-1.5">
          {logs.slice(0, 8).map((l) => (
            <div key={l.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs">
              <span>{ACTIVITY_LABEL[l.activityType]}</span>
              <span className="text-muted-foreground">{new Date(l.loggedAt).toLocaleString("ko")}</span>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

function BackLink() {
  return (
    <Link to="/teacher/roster" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-3 w-3" /> 명단으로
    </Link>
  );
}
