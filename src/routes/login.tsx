import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-context";
import type { Role } from "@/lib/mock-data";
import { z } from "zod";

const searchSchema = z.object({ role: z.enum(["parent", "teacher"]).optional() });

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  component: LoginPage,
});

function LoginPage() {
  const { role: roleParam } = Route.useSearch();
  const [role, setRole] = useState<Role>(roleParam ?? "parent");
  const [email, setEmail] = useState(role === "parent" ? "demo.parent@urnotalone.kr" : "demo.teacher@urnotalone.kr");
  const [password, setPassword] = useState("demo1234");
  const navigate = useNavigate();
  const { login } = useApp();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role, role === "parent" ? "수민이 엄마" : "햇살초 4-2 담임");
    navigate({ to: role === "parent" ? "/parent/home" : "/teacher/class" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-soft to-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <div className="mb-6 text-center">
          <div className="text-3xl">🌱</div>
          <h1 className="mt-2 text-xl font-bold">로그인</h1>
          <p className="mt-1 text-xs text-muted-foreground">Stage 1 데모 · 어떤 이메일이든 입장할 수 있어요</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1 text-xs">
          {(["parent", "teacher"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setEmail(r === "parent" ? "demo.parent@urnotalone.kr" : "demo.teacher@urnotalone.kr");
              }}
              className={`rounded-lg py-2 font-medium transition-colors ${
                role === r ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "parent" ? "보호자" : "교사"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="h-11 w-full rounded-xl">
            로그인
          </Button>
        </form>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          처음이세요?{" "}
          <button
            type="button"
            onClick={() => navigate({ to: "/signup", search: { role } as any })}
            className="text-primary hover:underline"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
