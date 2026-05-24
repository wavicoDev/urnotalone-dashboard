import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartHandshake, ShieldCheck, School } from "lucide-react";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const { login, session } = useApp();

  const demoEnter = (role: "parent" | "teacher") => {
    login(
      role === "parent" ? "demo.parent@urnotalone.kr" : "demo.teacher@urnotalone.kr",
      role,
      role === "parent" ? "수민이 엄마" : "햇살초 4-2 담임",
    );
    navigate({ to: role === "parent" ? "/parent/home" : "/teacher/class" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-soft to-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <span className="text-sm font-semibold">URNOTALONE</span>
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <Link to="/about" className="rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-accent">소개</Link>
          <Link to="/governance" className="rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-accent">데이터 거버넌스</Link>
          <Link to="/login" className="rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-accent">로그인</Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-card/80 px-3 py-1 text-xs text-muted-foreground shadow-sm">
          <HeartHandshake className="h-3.5 w-3.5 text-primary" /> 도리는 아이의 친구, 우리는 그 옆의 어른
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          아이의 마음 신호를
          <br />
          <span className="text-primary">부드럽게</span> 전해드려요
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          7~12세 아동이 AI 친구 ‘도리’와 나눈 정서 흐름을, 대화 내용은 보호하고 신호만 보여드립니다.
          보호자에게는 다정한 코칭을, 교사에게는 학급 단위의 조기 신호를.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="h-12 rounded-xl px-6" onClick={() => demoEnter("parent")}>
            보호자 데모 체험 <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 rounded-xl px-6" onClick={() => demoEnter("teacher")}>
            교사 데모 체험
          </Button>
        </div>

        {session ? (
          <div className="mt-4 text-xs text-muted-foreground">
            이미 로그인됨 ·{" "}
            <Link
              to={session.role === "parent" ? "/parent/home" : "/teacher/class"}
              className="text-primary underline-offset-2 hover:underline"
            >
              대시보드로
            </Link>
          </div>
        ) : null}
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-20 sm:grid-cols-3">
        <Feature icon={<HeartHandshake className="h-5 w-5" />} title="보호자용" desc="자녀 1명을 위한 정서 가교. 매주 코칭 카드와 위기 알림을 받아요." />
        <Feature icon={<School className="h-5 w-5" />} title="교사용" desc="학급 20~30명의 정서 상태를 한 화면에서. 위기 신호 큐와 주간 리포트." />
        <Feature icon={<ShieldCheck className="h-5 w-5" />} title="대화는 보호" desc="원문은 절대 노출하지 않고, 추출된 신호만 전달합니다." />
      </section>

      <footer className="border-t border-border/50 py-6 text-center text-[11px] text-muted-foreground">
        <Link to="/privacy" className="px-2 hover:underline">개인정보 처리방침</Link>·
        <Link to="/terms" className="px-2 hover:underline">이용약관</Link>·
        <Link to="/governance" className="px-2 hover:underline">데이터 거버넌스</Link>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-left shadow-[var(--shadow-card)]">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}
