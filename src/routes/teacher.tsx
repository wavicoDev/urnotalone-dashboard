import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { SideNav, type SideNavItem } from "@/components/side-nav";
import { useRequireRole } from "@/lib/use-require-role";
import { useApp } from "@/lib/app-context";
import { Bell, Home, Users, FileText, Sparkles, Settings } from "lucide-react";

export const Route = createFileRoute("/teacher")({ component: TeacherLayout });

const items: SideNavItem[] = [
  { to: "/teacher/home", label: "학급 마음 지도", icon: Home },
  { to: "/teacher/roster", label: "학생 명단", icon: Users },
  { to: "/teacher/alerts", label: "신호 알림", icon: Bell },
  { to: "/teacher/activities", label: "활동 라이브러리", icon: Sparkles },
  { to: "/teacher/report", label: "학급 주간 리포트", icon: FileText },
  { to: "/teacher/account", label: "계정 · 설정", icon: Settings },
];

function TeacherLayout() {
  useRequireRole("teacher");
  const { classRoom } = useApp();
  return (
    <div className="flex min-h-screen bg-background">
      <SideNav items={items} title="교사 대시보드" />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          title={`${classRoom.schoolName} ${classRoom.gradeLevel}-${classRoom.classNumber}반`}
          subtitle="교사 대시보드"
        />
        <Outlet />
      </div>
    </div>
  );
}
