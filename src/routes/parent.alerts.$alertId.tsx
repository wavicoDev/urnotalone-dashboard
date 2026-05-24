import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { PageContainer } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Phone, ShieldAlert, ArrowLeft, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CategoryBadge, SeverityBadge } from "@/components/alert-card";

export const Route = createFileRoute("/parent/alerts/$alertId")({ component: Page });

const DONTS = [
  "평가·강요 없이 들어주세요. (‘왜 그랬어?’ ❌)",
  "비밀로 하겠다는 약속은 피해주세요.",
  "‘그건 별일 아냐’로 감정을 축소하지 마세요.",
  "당장의 해결책보다 함께 있어주기를 우선해 주세요.",
];

const OPENERS = [
  "‘오늘 마음이 좀 어땠어?’ — 가볍게 마음의 문을 두드려요.",
  "‘오늘 도리랑 무슨 이야기 했어?’ — 도리를 매개로 자연스럽게.",
  "‘엄마/아빠도 어릴 때 그런 적 있어’ — 공감의 다리 놓기.",
];

function Page() {
  const { alertId } = useParams({ from: "/parent/alerts/$alertId" });
  const { alerts, acknowledgeAlert, children } = useApp();
  const navigate = useNavigate();
  const alert = alerts.find((a) => a.id === alertId);
  const [note, setNote] = useState(alert?.note ?? "");

  if (!alert) {
    return (
      <PageContainer>
        <div className="text-sm text-muted-foreground">알림을 찾을 수 없어요.</div>
      </PageContainer>
    );
  }
  const child = children.find((c) => c.id === alert.childId);

  return (
    <PageContainer>
      <Link
        to="/parent/alerts"
        className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> 알림 목록
      </Link>

      <div className="rounded-2xl border-l-4 border border-border bg-card p-6 shadow-[var(--shadow-card)]"
           style={{ borderLeftColor: alert.severity === 3 ? "var(--alert-3)" : "var(--alert-2)" }}>
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={alert.severity} />
          <CategoryBadge category={alert.category} />
          <span className="text-xs text-muted-foreground">· {child?.name}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {new Date(alert.detectedAt).toLocaleString("ko")}
          </span>
        </div>
        <p className="mt-3 text-base leading-relaxed">{alert.alertMessage}</p>
      </div>

      {alert.severity === 3 ? (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[var(--alert-3)]/30 bg-[var(--alert-3)]/10 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-[var(--alert-3)]" />
          <div className="text-sm">
            <strong>외부 자원 즉시 연결을 권장합니다.</strong> 자해·학대 관련 신호가 감지되었어요. 아래 자원으로 연결해 주세요.
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold">권장 대응 가이드 · 4가지 금기</h3>
          <ul className="space-y-2 text-sm">
            {DONTS.map((d) => (
              <li key={d} className="flex gap-2"><span>•</span><span className="text-foreground/80">{d}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold">자연스럽게 말 걸기 3가지</h3>
          <ul className="space-y-2 text-sm">
            {OPENERS.map((d) => (
              <li key={d} className="rounded-lg bg-primary-soft p-2 text-foreground/90">{d}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">외부 자원</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          <ResourceButton name="Wee센터" tel="1588-7179" />
          <ResourceButton name="청소년 상담 1388" tel="1388" />
          <ResourceButton name="자살예방 1393" tel="1393" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-2 text-sm font-semibold">메모 · 확인 완료</h3>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="오늘 저녁 대화 내용 등을 남겨두세요."
          rows={4}
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button
            onClick={() => {
              acknowledgeAlert(alert.id, "parent", note);
              toast.success("확인 완료로 표시했어요.");
              navigate({ to: "/parent/alerts" });
            }}
            className="rounded-xl"
          >
            확인 완료
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

function ResourceButton({ name, tel }: { name: string; tel: string }) {
  return (
    <a
      href={`tel:${tel}`}
      className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm transition-colors hover:bg-accent"
    >
      <span className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-primary" />
        <span className="font-medium">{name}</span>
      </span>
      <span className="text-xs text-muted-foreground">{tel}</span>
    </a>
  );
}
