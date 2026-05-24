import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SideNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function SideNav({ items, title }: { items: SideNavItem[]; title: string }) {
  const location = useLocation();
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-card/50 md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 px-5">
          <span className="text-2xl">🌱</span>
          <div>
            <div className="text-sm font-semibold">URNOTALONE</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{title}</div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {items.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary-soft text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 text-[10px] text-muted-foreground">v0.1 · Stage 1 데모</div>
      </aside>

      {/* Mobile bottom tab */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border/60 bg-card/95 px-2 py-2 backdrop-blur md:hidden">
        {items.slice(0, 5).map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1 text-[10px]",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
