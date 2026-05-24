import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Sparkles } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { session, logout, alerts, classAlerts } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isTeacher = location.pathname.startsWith("/teacher");
  const list = isTeacher ? classAlerts : alerts;
  const recent = useMemo(() => list.slice(0, 5), [list]);
  const [open, setOpen] = useState(false);
  const unread = list.filter((a) => !a.acknowledgedAt).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-card/80 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-lg">🌱</div>
        <div>
          <div className="text-sm font-semibold tracking-tight">{title}</div>
          {subtitle ? <div className="text-xs text-muted-foreground">{subtitle}</div> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="relative rounded-xl p-2 hover:bg-accent"
              aria-label="알림"
            >
              <Bell className="h-5 w-5 text-foreground/80" />
              {unread > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-[var(--alert-3)]" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> 최근 알림
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recent.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                도리가 친구가 되는 중이에요.
              </div>
            ) : (
              recent.map((a) => (
                <DropdownMenuItem
                  key={a.id}
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: isTeacher ? "/teacher/alerts/$alertId" : "/parent/alerts/$alertId", params: { alertId: a.id } });
                  }}
                  className="flex flex-col items-start gap-1"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="inline-flex h-1.5 w-1.5 rounded-full"
                      style={{ background: a.severity === 3 ? "var(--alert-3)" : a.severity === 2 ? "var(--alert-2)" : "var(--alert-1)" }}
                    />
                    <span className="font-medium">Lv.{a.severity}</span>
                    <span className="text-muted-foreground">
                      {new Date(a.detectedAt).toLocaleString("ko", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="line-clamp-2 text-xs text-foreground/80">{a.alertMessage}</div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-accent">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {session?.name?.[0] ?? "?"}
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-xs font-medium">{session?.name ?? "Guest"}</div>
                <div className="text-[10px] text-muted-foreground">{session?.email}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate({ to: isTeacher ? "/teacher/account" : "/parent/account" })}
            >
              계정 · 동의 관리
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> 로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
