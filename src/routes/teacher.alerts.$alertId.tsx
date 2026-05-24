import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { PageContainer } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { CategoryBadge, SeverityBadge } from "@/components/alert-card";
import type { FollowUpAction } from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/alerts/$alertId")({ component: Page });

const ACTIONS: { value: FollowUpAction["actionType"]; label: string }[] = [
  { value: "talked_to_child", label: "학생과 대화" },
  { value: "contacted_parent", label: "보호자 연락" },
  { value: "referred_counselor", label: "Wee 상담사 연계" },
  { value: "external_referral", label: "외부 기관 연계" },
  { value: "other", label: "기타" },
];

function Page() {
  const { alertId } = useParams({ from: "/teacher/alerts/$alertId" });
  const { classAlerts, classStudents, acknowledgeAlert, addFollowUp, followUps } = useApp();
  const navigate = useNavigate();
  const alert = classAlerts.find((a) => a.id === alertId);
  const [actionType, setActionType] = useState<FollowUpAction["actionType"]>("talked_to_child");
  const [note, setNote] = useState("");

  if (!alert) return <PageContainer>알림을 찾을 수 없어요.</PageContainer>;
  const child = classStudents.find((c) => c.id === alert.childId);
  const displayName = child?.isAnonymous ? child?.anonymousCode : child?.name;
  const history = followUps.filter((f) => f.alertId === alert.id);

  return (
    <PageContainer>
      <Link to="/teacher/alerts" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> 알림 목록
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
           style={{ borderLeft: `4px solid ${alert.severity === 3 ? "var(--alert-3)" : "var(--alert-2)"}` }}>
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={alert.severity} />
          <CategoryBadge category={alert.category} />
          <span className="text-xs text-muted-foreground">· {displayName}</span>
          <span className="ml-auto text-xs text-muted-foreground">{new Date(alert.detectedAt).toLocaleString("ko")}</span>
        </div>
        <p className="mt-3 text-base leading-relaxed">{alert.alertMessage}</p>
        {child?.isAnonymous ? (
          <p className="mt-2 text-[11px] text-muted-foreground">
            ※ 보호자가 신호 상세 공개에 동의하지 않은 학생입니다. 학생 식별 정보는 표시되지 않아요.
          </p>
        ) : null}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">후속 조치 기록</h3>
        <div className="flex flex-wrap gap-2">
          {ACTIONS.map((a) => (
            <button
              key={a.value}
              onClick={() => setActionType(a.value)}
              className={`rounded-full px-3 py-1.5 text-xs ${
                actionType === a.value ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <Textarea
          className="mt-3"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="어떤 조치를 취했는지 적어 주세요."
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button
            className="rounded-xl"
            disabled={!note.trim()}
            onClick={() => {
              addFollowUp({ alertId: alert.id, actionType, note: note.trim() });
              acknowledgeAlert(alert.id, "teacher");
              toast.success("조치를 기록하고 확인 완료로 표시했어요.");
              navigate({ to: "/teacher/alerts" });
            }}
          >
            기록 + 확인 완료
          </Button>
        </div>

        {history.length ? (
          <div className="mt-5 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">이전 기록</div>
            {history.map((h) => (
              <div key={h.id} className="rounded-xl border border-border p-3 text-xs">
                <div className="text-[10px] text-muted-foreground">
                  {new Date(h.recordedAt).toLocaleString("ko")} · {ACTIONS.find((a) => a.value === h.actionType)?.label}
                </div>
                <div className="mt-1">{h.note}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}
