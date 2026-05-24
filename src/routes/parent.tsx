import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { SideNav, type SideNavItem } from "@/components/side-nav";
import { useRequireRole } from "@/lib/use-require-role";
import { useApp } from "@/lib/app-context";
import { Bell, Heart, Home, LineChart, MessageSquareHeart, Settings, Sparkles, Sprout } from "lucide-react";

export const Route = createFileRoute("/parent")({
  component: ParentLayout,
});

const items: SideNavItem[] = [
  { to: "/parent/home", label: "오늘의 마음", icon: Home },
  { to: "/parent/timeline", label: "감정 타임라인", icon: LineChart },
  { to: "/parent/growth", label: "성장 마일스톤", icon: Sprout },
  { to: "/parent/coaching", label: "주간 코칭 카드", icon: MessageSquareHeart },
  { to: "/parent/alerts", label: "위기 알림", icon: Bell },
  { to: "/parent/child", label: "자녀 프로필", icon: Heart },
  { to: "/parent/resources", label: "외부 자원", icon: Sparkles },
  { to: "/parent/account", label: "계정 · 동의", icon: Settings },
];

function ParentLayout() {
  useRequireRole("parent");
  const { children } = useApp();
  const child = children[0];

  return (
    <div className="flex min-h-screen bg-background">
      <SideNav items={items} title="보호자 대시보드" />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader title={`${child?.name ?? "자녀"}이의 오늘`} subtitle="보호자 대시보드" />
        <Outlet />
      </div>
    </div>
  );
}
