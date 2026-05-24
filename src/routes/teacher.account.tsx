import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp, useSession } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/account")({ component: Page });

function Page() {
  const session = useSession();
  const { logout, resetDemo, classRoom } = useApp();
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageTitle title="계정 · 학급 설정" description="로그인 정보와 학급 정보를 관리해요." />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 text-sm font-semibold">계정</h2>
        <Row label="이름" value={session?.name ?? "-"} />
        <Row label="이메일" value={session?.email ?? "-"} />
        <Row label="역할" value="교사" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => { logout(); navigate({ to: "/" }); }}>
            로그아웃
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl text-destructive hover:text-destructive"
            onClick={() => {
              if (confirm("데모 데이터를 초기화할까요?")) { resetDemo(); toast.success("초기화 완료"); }
            }}
          >
            데모 데이터 초기화
          </Button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 text-sm font-semibold">학급 정보</h2>
        <Row label="학교" value={classRoom.schoolName} />
        <Row label="학년 · 반" value={`${classRoom.gradeLevel}학년 ${classRoom.classNumber}반`} />
        <Row label="학년도" value={String(classRoom.schoolYear)} />
        <Row label="학생 수" value={`${classRoom.studentIds.length}명`} />
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-primary-soft p-6">
        <h2 className="mb-2 text-sm font-semibold">데이터 윤리 안내</h2>
        <ul className="space-y-1.5 text-sm text-foreground/80">
          <li>· 대화 원문은 저장·표시되지 않습니다.</li>
          <li>· 보호자 미동의 학생은 익명 코드로만 보여요.</li>
          <li>· Lv.3 신호는 보호자에게 외부 자원 연결을 강제 노출합니다.</li>
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
