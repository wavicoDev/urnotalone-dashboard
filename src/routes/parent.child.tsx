import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageTitle } from "@/components/page";
import { useApp } from "@/lib/app-context";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X } from "lucide-react";

export const Route = createFileRoute("/parent/child")({ component: Page });

function Page() {
  const { children, updateChild } = useApp();
  const [activeId, setActiveId] = useState(children[0].id);
  const child = children.find((c) => c.id === activeId)!;
  const [draft, setDraft] = useState(child);
  const [friendInput, setFriendInput] = useState("");

  const dirty = JSON.stringify(draft) !== JSON.stringify(child);
  const teacherVisibility = !draft.isAnonymous;

  const select = (id: string) => {
    setActiveId(id);
    const next = children.find((c) => c.id === id)!;
    setDraft(next);
  };

  return (
    <PageContainer>
      <PageTitle title="자녀 프로필" description="자녀별 관심 주제와 동의 설정을 관리하세요." />

      {children.length > 1 ? (
        <div className="mb-4 flex gap-2">
          {children.map((c) => (
            <button
              key={c.id}
              onClick={() => select(c.id)}
              className={`rounded-xl border px-4 py-2 text-sm ${
                activeId === c.id ? "border-primary bg-primary-soft" : "border-border bg-card"
              }`}
            >
              {c.name} · 초{c.gradeLevel}
            </button>
          ))}
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="이름">
            <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="학년 (초등)">
            <Input
              type="number"
              min={1}
              max={6}
              value={draft.gradeLevel}
              onChange={(e) => setDraft({ ...draft, gradeLevel: Number(e.target.value) })}
            />
          </Field>
          <Field label="보호자 호칭">
            <Input
              value={draft.parentNickname}
              onChange={(e) => setDraft({ ...draft, parentNickname: e.target.value })}
              placeholder="엄마 / 아빠 / 보호자님"
            />
          </Field>
          <Field label="생년월일">
            <Input
              type="date"
              value={draft.birthDate}
              onChange={(e) => setDraft({ ...draft, birthDate: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-xs text-muted-foreground">자주 언급되는 친구</div>
          <div className="flex flex-wrap gap-2">
            {draft.friendsMentioned.map((f) => (
              <span key={f} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">
                {f}
                <button
                  onClick={() => setDraft({ ...draft, friendsMentioned: draft.friendsMentioned.filter((x) => x !== f) })}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const v = friendInput.trim();
              if (!v || draft.friendsMentioned.includes(v)) return;
              setDraft({ ...draft, friendsMentioned: [...draft.friendsMentioned, v] });
              setFriendInput("");
            }}
          >
            <Input
              value={friendInput}
              onChange={(e) => setFriendInput(e.target.value)}
              placeholder="친구 이름 또는 별명"
            />
            <Button type="submit" variant="outline" className="rounded-xl">
              추가
            </Button>
          </form>
        </div>

        <div className="mt-6 space-y-3 rounded-2xl bg-primary-soft p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-foreground/70">동의 설정</div>
          <ToggleRow
            label="교사에게 신호 상세 공개"
            description="끄면 학급 대시보드에는 익명 코드로만 표시됩니다."
            checked={teacherVisibility}
            onChange={(v) => setDraft({ ...draft, isAnonymous: !v })}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            disabled={!dirty}
            onClick={() => {
              const { id, ...patch } = draft;
              updateChild(id, patch);
              toast.success("프로필을 저장했어요.");
            }}
            className="rounded-xl"
          >
            저장
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-card p-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[11px] text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
