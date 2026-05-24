import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <PolicyShell title="URNOTALONE 소개">
      <p>
        URNOTALONE은 7~12세 아동의 정서 케어를 위한 AI 친구 ‘도리’와, 그 아이의 신호를 보호자·교사에게
        부드럽게 전하는 대시보드 서비스입니다.
      </p>
      <p>
        이 서비스의 의미는 단 하나, <strong>아이의 신호가 적절히 닿는 것</strong>입니다. 대화 원문은 절대 노출하지 않고,
        감정 분포·활동 누적·위기 수준 같은 추출된 신호만 보여드립니다.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>보호자 대시보드: 자녀 1명을 위한 1:1 정서 가교</li>
        <li>교사 대시보드: 학급 20~30명을 위한 1:N 조기 발견자</li>
      </ul>
    </PolicyShell>
  );
}

export function PolicyShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            🌱 URNOTALONE
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            홈으로 →
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">{title}</h1>
        <div className="space-y-4 text-sm leading-7 text-foreground/80">{children}</div>
      </main>
    </div>
  );
}
