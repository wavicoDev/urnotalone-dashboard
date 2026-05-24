import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { RolePlayCard } from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/activities")({ component: Page });

const CATEGORIES: { value: RolePlayCard["category"]; label: string }[] = [
  { value: "peer", label: "또래" },
  { value: "academic", label: "학업" },
  { value: "family", label: "가족" },
  { value: "self_expression", label: "자기표현" },
  { value: "custom", label: "직접 만든 카드" },
];

function Page() {
  const { rolePlayCards, addRolePlayCard, classRoom } = useApp();
  const [tab, setTab] = useState<"all" | RolePlayCard["category"]>("all");
  const [open, setOpen] = useState(false);

  const list = rolePlayCards.filter((c) => tab === "all" || c.category === tab);

  return (
    <PageContainer>
      <PageTitle
        title="활동 라이브러리"
        description="역할극·SEL 카드를 모아두고, 우리 반에 맞는 카드를 직접 만들 수 있어요."
        action={
          <Button className="rounded-xl" onClick={() => setOpen((v) => !v)}>
            <Plus className="mr-1 h-4 w-4" /> 카드 만들기
          </Button>
        }
      />

      {open ? <NewCardForm onSubmit={(payload) => { addRolePlayCard(payload); setOpen(false); toast.success("카드를 라이브러리에 추가했어요."); }} /> : null}

      <div className="mb-4 mt-4 flex flex-wrap gap-2">
        <Chip active={tab === "all"} onClick={() => setTab("all")}>전체</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.value} active={tab === c.value} onClick={() => setTab(c.value)}>
            {c.label}
          </Chip>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((c) => (
          <div key={c.id} className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">
                {CATEGORIES.find((cat) => cat.value === c.category)?.label}
              </span>
              <span className="ml-auto text-[10px] text-muted-foreground">
                {c.scope === "class" ? `우리 반 (${classRoom.classNumber}반)` : "기본 라이브러리"}
              </span>
            </div>
            <h3 className="text-sm font-semibold">{c.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}
    >
      {children}
    </button>
  );
}

function NewCardForm({ onSubmit }: { onSubmit: (p: Omit<RolePlayCard, "id" | "createdAt" | "scope" | "classId">) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RolePlayCard["category"]>("custom");
  const [role, setRole] = useState<RolePlayCard["role"]>("friend");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title: title.trim(), description: description.trim(), category, role, ageGroup: "all" });
      }}
      className="mt-4 rounded-2xl border border-border bg-card p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">제목</span>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 친구가 큰소리로 화를 낼 때" />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">카테고리</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as RolePlayCard["category"])}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
          </select>
        </label>
        <label className="block text-xs sm:col-span-2">
          <span className="mb-1 block text-muted-foreground">설명</span>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="활동의 목적과 진행 방식" />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">상대 역할</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RolePlayCard["role"])}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="friend">친구</option>
            <option value="teacher">선생님</option>
            <option value="parent">보호자</option>
            <option value="stranger">처음 만난 사람</option>
          </select>
        </label>
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="submit" className="rounded-xl" disabled={!title.trim()}>저장</Button>
      </div>
    </form>
  );
}
