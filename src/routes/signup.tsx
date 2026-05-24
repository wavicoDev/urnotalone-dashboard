import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/lib/app-context";
import type { Role } from "@/lib/mock-data";

const searchSchema = z.object({ role: z.enum(["parent", "teacher"]).optional() });

export const Route = createFileRoute("/signup")({
  validateSearch: searchSchema,
  component: SignupPage,
});

function SignupPage() {
  const { role: roleParam } = Route.useSearch();
  const [role, setRole] = useState<Role>(roleParam ?? "parent");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const { login } = useApp();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    login(email || `new.${role}@urnotalone.kr`, role, name || (role === "parent" ? "보호자" : "교사"));
    navigate({ to: "/onboarding", search: { role } as any });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-soft to-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-xl font-bold">회원가입</h1>
        <p className="mt-1 text-xs text-muted-foreground">가입 후 자녀 또는 학급을 등록해 주세요.</p>

        <div className="my-5 grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1 text-xs">
          {(["parent", "teacher"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-lg py-2 font-medium ${role === r ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              {r === "parent" ? "보호자로 가입" : "교사로 가입"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">이름</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 김수민" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">비밀번호</Label>
            <Input id="pw" type="password" defaultValue="demo1234" required />
          </div>

          <label className="flex cursor-pointer items-start gap-2 rounded-xl bg-primary-soft/60 p-3 text-xs">
            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} className="mt-0.5" />
            <span className="text-foreground/80">
              (필수) 개인정보 처리방침 및 만 14세 미만 아동의 보호자 동의 정책에 동의합니다.
            </span>
          </label>

          <Button type="submit" className="h-11 w-full rounded-xl" disabled={!agree}>
            동의하고 다음 단계로
          </Button>
        </form>
      </div>
    </div>
  );
}
