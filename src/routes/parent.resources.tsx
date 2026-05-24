import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { ExternalLink, Phone, BookOpen, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/parent/resources")({ component: Page });

const HOTLINES = [
  { name: "청소년 상담 1388", tel: "1388", desc: "24시간 청소년 상담" },
  { name: "자살예방 상담 1393", tel: "1393", desc: "위기 상담 24시간" },
  { name: "학교폭력 신고 117", tel: "117", desc: "학교폭력 긴급" },
  { name: "Wee센터", tel: "1588-7179", desc: "학교 상담 연계" },
];

const READS = [
  { title: "초등 자녀와의 대화법 입문", subtitle: "비폭력 대화 5가지 원칙", tag: "도서" },
  { title: "아이의 감정을 읽어주는 부모", subtitle: "공감 코칭 가이드", tag: "도서" },
  { title: "사춘기 직전, 마음을 지키는 법", subtitle: "10~12세 보호자용", tag: "아티클" },
];

export default function Page() {
  return (
    <PageContainer>
      <PageTitle title="외부 자원 가이드" description="상황별 도움 받을 수 있는 곳을 모았어요." />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Phone className="h-4 w-4 text-primary" /> 즉시 도움 받기
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {HOTLINES.map((h) => (
            <a
              key={h.tel}
              href={`tel:${h.tel}`}
              className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3 hover:bg-accent"
            >
              <div>
                <div className="text-sm font-medium">{h.name}</div>
                <div className="text-[11px] text-muted-foreground">{h.desc}</div>
              </div>
              <span className="text-sm text-primary">{h.tel}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <BookOpen className="h-4 w-4 text-primary" /> 추천 읽을거리
        </h2>
        <div className="space-y-2">
          {READS.map((r) => (
            <div key={r.title} className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <div className="text-sm font-medium">{r.title}</div>
                <div className="text-[11px] text-muted-foreground">{r.subtitle}</div>
              </div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{r.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-primary-soft p-6">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <HeartHandshake className="h-4 w-4 text-primary" /> 지역 상담 센터 찾기
        </h2>
        <p className="text-sm text-foreground/80">
          정식 출시 시 지역(구·시) 기반 상담 센터 검색이 제공됩니다. 지금은 위 핫라인을 통해 안내받을 수 있어요.
        </p>
        <a
          href="https://www.wee.go.kr"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          Wee 프로젝트 바로가기 <ExternalLink className="h-3 w-3" />
        </a>
      </section>
    </PageContainer>
  );
}
