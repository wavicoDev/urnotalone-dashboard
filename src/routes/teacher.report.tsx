import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { EmotionDistributionDonut, EmotionTimelineChart } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import type { Emotion } from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/report")({ component: Page });

function Page() {
  const { classLogs, classStudents, classAlerts, classRoom } = useApp();

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);

  const weekLogs = classLogs.filter((l) => new Date(l.loggedAt) >= weekStart);
  const careStudents = new Set(
    weekLogs.filter((l) => l.primaryEmotion === "sad" || l.primaryEmotion === "very_sad").map((l) => l.childId),
  );

  const counts: Record<Emotion, number> = {
    very_sad: 0, sad: 0, neutral: 0, happy: 0, very_happy: 0, unknown: 0,
  };
  weekLogs.forEach((l) => { counts[l.primaryEmotion] += 1; });

  const download = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`Weekly Class Report`, 40, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`${classRoom.schoolName}  ${classRoom.gradeLevel}-${classRoom.classNumber}`, 40, 82);
    doc.text(`${weekStart.toISOString().slice(0, 10)} ~ ${today.toISOString().slice(0, 10)}`, 40, 100);
    doc.text(`Active students this week: ${new Set(weekLogs.map((l) => l.childId)).size}/${classStudents.length}`, 40, 130);
    doc.text(`Students needing extra care: ${careStudents.size}`, 40, 148);
    doc.text(`Open alerts: ${classAlerts.filter((a) => !a.acknowledgedAt).length}`, 40, 166);
    doc.setFont("helvetica", "bold");
    doc.text(`Emotion distribution`, 40, 200);
    doc.setFont("helvetica", "normal");
    let y = 220;
    Object.entries(counts).forEach(([k, v]) => {
      doc.text(`- ${k}: ${v}`, 50, y);
      y += 16;
    });
    doc.save(`class-report-${today.toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF 다운로드를 시작합니다.");
  };

  return (
    <PageContainer>
      <PageTitle
        title="학급 주간 리포트"
        description={`${weekStart.toLocaleDateString("ko")} ~ ${today.toLocaleDateString("ko")} · 익명 통계로 구성됩니다.`}
        action={
          <Button variant="outline" className="rounded-xl" onClick={download}>
            <Download className="mr-1.5 h-4 w-4" /> PDF 다운로드
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="이번 주 활동 학생" value={`${new Set(weekLogs.map((l) => l.childId)).size}/${classStudents.length}`} />
        <Stat label="돌봄 필요 학생" value={`${careStudents.size}`} tone="warm" />
        <Stat label="미확인 신호" value={`${classAlerts.filter((a) => !a.acknowledgedAt).length}`} tone="primary" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-2 text-xs text-muted-foreground">학급 감정 흐름 (7일 평균)</div>
          <EmotionTimelineChart logs={weekLogs} days={7} height={240} />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 text-xs text-muted-foreground">감정 분포</div>
          <EmotionDistributionDonut logs={weekLogs} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-primary-soft p-5">
        <h3 className="mb-1 text-sm font-semibold">이번 주 학급 인사이트</h3>
        <p className="text-sm text-foreground/80">
          또래 관계 카테고리에서 신호가 가장 많이 나타났어요. 다음 주 학급 활동으로
          ‘친구가 놀이에 끼워주지 않을 때’ 역할극 카드를 추천합니다.
        </p>
      </div>
    </PageContainer>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "primary" | "warm" }) {
  const bg = tone === "primary" ? "bg-primary-soft" : tone === "warm" ? "bg-[var(--color-accent-warm)]/15" : "bg-card";
  return (
    <div className={`rounded-2xl border border-border ${bg} p-5 shadow-[var(--shadow-card)]`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-bold">{value}</div>
    </div>
  );
}
