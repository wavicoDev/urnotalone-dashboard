import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp, useSession } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/parent/account")({ component: Page });

function Page() {
  const session = useSession();
  const { logout, resetDemo, notifications } = useApp();
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageTitle title="계정 · 동의 관리" description="로그인 정보와 데이터 사용 동의를 관리해요." />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 text-sm font-semibold">계정</h2>
        <Row label="이름" value={session?.name ?? "-"} />
        <Row label="이메일" value={session?.email ?? "-"} />
        <Row label="역할" value="보호자" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
          >
            로그아웃
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl text-destructive hover:text-destructive"
            onClick={() => {
              if (confirm("데모 데이터를 초기 상태로 되돌릴까요?")) {
                resetDemo();
                toast.success("데모 데이터를 초기화했어요.");
              }
            }}
          >
            데모 데이터 초기화
          </Button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 text-sm font-semibold">알림 수신 기록</h2>
        {notifications.length === 0 ? (
          <div className="text-xs text-muted-foreground">기록이 없어요.</div>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 8).map((n) => (
              <div key={n.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="uppercase tracking-widest">{n.channel} · {n.type}</span>
                  <span>{new Date(n.sentAt).toLocaleString("ko")}</span>
                </div>
                <div className="mt-1 text-sm font-medium">{n.subject}</div>
                <div className="text-xs text-muted-foreground">{n.body}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-primary-soft p-6">
        <h2 className="mb-2 text-sm font-semibold">데이터 정책 요약</h2>
        <ul className="space-y-1.5 text-sm text-foreground/80">
          <li>· 대화 원문은 저장·표시되지 않습니다.</li>
          <li>· 위기 알림은 추상화된 본문으로만 전달됩니다.</li>
          <li>· 동의 철회 시 30일 이내 모든 관련 데이터를 삭제합니다.</li>
        </ul>
      </section>
    </PageContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
