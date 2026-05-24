import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { ExternalLink, Phone, BookOpen, HeartHandshake, FileText, Users } from "lucide-react";

export const Route = createFileRoute("/teacher/resources")({ component: Page });

const HOTLINES = [
  { name: "청소년 상담 1388", tel: "1388", desc: "24시간 청소년 상담" },
  { name: "자살예방 상담 1393", tel: "1393", desc: "위기 상담 24시간" },
  { name: "학교폭력 신고 117", tel: "117", desc: "학교폭력 긴급" },
  { name: "Wee센터", tel: "1588-7179", desc: "학교 상담 연계" },
  { name: "아동보호전문기관", tel: "112", desc: "아동학대 신고" },
];

const TEACHER_RESOURCES = [
  { title: "학교폭력 사안처리 가이드", subtitle: "교육부 공식 매뉴얼", tag: "가이드" },
  { title: "정서행동특성검사 결과 활용", subtitle: "선별검사 후속 조치", tag: "매뉴얼" },
  { title: "위기 학생 조기 발견 체크리스트", subtitle: "담임교사용", tag: "체크리스트" },
  { title: "학부모 상담 커뮤니케이션", subtitle: "민감 사안 전달법", tag: "가이드" },
];

const REFERRAL_STEPS = [
  { step: 1, title: "Wee클래스 상담", desc: "교내 상담교사와 1차 상담" },
  { step: 2, title: "Wee센터 연계", desc: "교육지원청 전문 상담 의뢰" },
  { step: 3, title: "전문기관 연계", desc: "정신건강복지센터, 병원 등" },
];

export default function Page() {
  return (
    <PageContainer>
      <PageTitle
        title="외부 자원 가이드"
        description="위기 학생 연계 및 교사 지원 자료를 모았어요."
      />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Phone className="h-4 w-4 text-primary" /> 긴급 연락처
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
              <span className="text-sm font-semibold text-primary">{h.tel}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4 text-primary" /> 연계 절차
        </h2>
        <div className="flex flex-wrap gap-3">
          {REFERRAL_STEPS.map((s, i) => (
            <div key={s.step} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.step}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium">{s.title}</div>
                <div className="text-[11px] text-muted-foreground">{s.desc}</div>
              </div>
              {i < REFERRAL_STEPS.length - 1 && (
                <span className="mx-2 text-muted-foreground">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-primary" /> 교사용 자료
        </h2>
        <div className="space-y-2">
          {TEACHER_RESOURCES.map((r) => (
            <div key={r.title} className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-accent/50">
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
          <HeartHandshake className="h-4 w-4 text-primary" /> Wee 프로젝트
        </h2>
        <p className="text-sm text-foreground/80">
          Wee 프로젝트는 학교-교육청-지역사회가 연계한 학생 정서 지원 시스템입니다.
          학교 내 Wee클래스, 교육지원청 Wee센터, 시·도 Wee스쿨로 단계적 지원이 가능합니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="https://www.wee.go.kr"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-card px-3 py-1.5 text-sm font-medium text-primary hover:bg-accent"
          >
            Wee 프로젝트 <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://www.moe.go.kr"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-card px-3 py-1.5 text-sm font-medium text-primary hover:bg-accent"
          >
            교육부 <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--alert-2)]/30 bg-[var(--alert-2)]/10 p-6">
        <h2 className="mb-2 text-sm font-semibold text-[var(--alert-2)]">Lv.3 위기 상황 시</h2>
        <ul className="space-y-1.5 text-sm text-foreground/80">
          <li>· 학생 안전 확보를 최우선으로 합니다.</li>
          <li>· 즉시 관리자(교감·교장)에게 보고합니다.</li>
          <li>· 보호자에게 연락하고, 필요시 119 또는 112에 신고합니다.</li>
          <li>· 학교 내 위기관리위원회를 소집합니다.</li>
        </ul>
      </section>
    </PageContainer>
  );
}
