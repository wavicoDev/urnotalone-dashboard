import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-context";
import { toast } from "sonner";

const searchSchema = z.object({ role: z.enum(["parent", "teacher"]).optional() });

export const Route = createFileRoute("/onboarding")({
  validateSearch: searchSchema,
  component: OnboardingPage,
});

function OnboardingPage() {
  const { role } = Route.useSearch();
  const { session } = useApp();
  const navigate = useNavigate();
  const effectiveRole = role ?? session?.role ?? "parent";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-soft to-background px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <div className="mb-6 text-center">
          <div className="text-3xl">🌱</div>
          <h1 className="mt-2 text-xl font-bold">
            {effectiveRole === "parent" ? "자녀 등록 · 도리 앱 페어링" : "학교 인증 · 학급 설정"}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">데모에서는 기본값으로 진행됩니다.</p>
        </div>

        {effectiveRole === "parent" ? <ParentOnboarding /> : <TeacherOnboarding />}

        <Button
          className="mt-6 h-11 w-full rounded-xl"
          onClick={() => {
            toast.success("준비 완료! 데모 데이터로 시작합니다.");
            navigate({ to: effectiveRole === "parent" ? "/parent/home" : "/teacher/class" });
          }}
        >
          대시보드로 입장
        </Button>
      </div>
    </div>
  );
}

function ParentOnboarding() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="자녀 이름" defaultValue="수민" />
        <Field label="학년" defaultValue="4학년" />
      </div>
      <Field label="부모 호칭 (도리가 부를 이름)" defaultValue="엄마" />
      <Field label="도리 앱 페어링 코드" defaultValue="DORI-7821-WAVE" />
      <div className="rounded-xl bg-primary-soft p-3 text-xs text-foreground/80">
        보호자 동의는 만 14세 미만 아동의 모든 신호 수집 전제 조건입니다. 동의 철회 시 30일 이내 모든 데이터를 삭제합니다.
      </div>
    </div>
  );
}

function TeacherOnboarding() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="학교명" defaultValue="햇살초등학교" />
        <Field label="교사 인증 코드" defaultValue="TC-2026-04-02" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="학년" defaultValue="4학년" />
        <Field label="반" defaultValue="2반" />
      </div>
      <div className="rounded-xl bg-primary-soft p-3 text-xs text-foreground/80">
        학생 명단은 보호자 동의 수령 시에만 실명·신호가 표시됩니다. 미동의 학생은 익명 코드(학생A 등)로만 보입니다.
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  const [v, setV] = useState(defaultValue);
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={v} onChange={(e) => setV(e.target.value)} />
    </div>
  );
}
