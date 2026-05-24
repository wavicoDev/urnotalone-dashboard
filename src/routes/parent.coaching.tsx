import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import type { WeeklyCoachingCard } from "@/lib/mock-data";

export const Route = createFileRoute("/parent/coaching")({ component: Page });

function Page() {
  const { coaching, children } = useApp();
  const [latest, ...rest] = coaching;
  const child = children[0];

  return (
    <PageContainer>
      <PageTitle title="주간 코칭 카드" description="매주 일요일 자동 발행됩니다." />

      {latest ? <CoachingHero card={latest} childName={child.name} /> : null}

      <h2 className="mt-10 mb-3 text-sm font-semibold">이전 카드</h2>
      <div className="space-y-3">
        {rest.length === 0 && <div className="text-xs text-muted-foreground">아직 이전 카드가 없어요.</div>}
        {rest.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[11px] text-muted-foreground">
              {c.weekStart} ~ {c.weekEnd}
            </div>
            <div className="mt-1 text-sm font-semibold">{c.headline}</div>
            <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.insight}</div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

function CoachingHero({ card, childName }: { card: WeeklyCoachingCard; childName: string }) {
  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`Weekly Coaching Card`, 40, 60);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Child: ${childName}`, 40, 90);
    doc.text(`Week: ${card.weekStart} ~ ${card.weekEnd}`, 40, 108);
    doc.setFont("helvetica", "bold");
    doc.text(`Headline`, 40, 150);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(card.headline, 500), 40, 170);
    doc.setFont("helvetica", "bold");
    doc.text(`Insight`, 40, 220);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(card.insight, 500), 40, 240);
    doc.setFont("helvetica", "bold");
    doc.text(`Coaching`, 40, 320);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(card.coaching, 500), 40, 340);
    doc.setFont("helvetica", "bold");
    doc.text(`Suggested Activity`, 40, 420);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(card.suggestedActivity, 500), 40, 440);
    doc.save(`coaching-${card.weekStart}.pdf`);
    toast.success("PDF 다운로드를 시작합니다.");
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {card.weekStart} ~ {card.weekEnd}
          </div>
          <h2 className="mt-1 text-2xl font-bold">{card.headline}</h2>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={downloadPdf}>
          <Download className="mr-1.5 h-4 w-4" /> PDF 다운로드
        </Button>
      </div>

      <div className="mt-6 space-y-5 text-sm leading-relaxed">
        <Section label="이번 주 핵심 신호" tone="primary">
          {card.insight}
        </Section>
        <Section label="대화법 코칭" tone="warm">
          {card.coaching}
        </Section>
        <Section label="함께 해볼 작은 활동" tone="mint">
          {card.suggestedActivity}
        </Section>
      </div>
    </div>
  );
}

function Section({ label, tone, children }: { label: string; tone: "primary" | "warm" | "mint"; children: React.ReactNode }) {
  const bg =
    tone === "primary"
      ? "bg-primary-soft"
      : tone === "warm"
        ? "bg-[var(--color-accent-warm)]/15"
        : "bg-[var(--color-accent-mint)]/20";
  return (
    <div className={`rounded-2xl ${bg} p-4`}>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/70">{label}</div>
      <div className="text-foreground/90">{children}</div>
    </div>
  );
}
