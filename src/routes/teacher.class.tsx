import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/teacher/class")({
  beforeLoad: () => {
    throw redirect({ to: "/teacher/home" });
  },
});
