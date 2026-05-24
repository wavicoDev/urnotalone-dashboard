import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import type { Role } from "@/lib/mock-data";

export function useRequireRole(role: Role) {
  const { session } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    if (!session) {
      navigate({ to: "/login", search: { role } as any });
    } else if (session.role !== role) {
      navigate({ to: session.role === "parent" ? "/parent/home" : "/teacher/class" });
    }
  }, [session, role, navigate]);
  return session;
}
