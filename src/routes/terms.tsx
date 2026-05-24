import { createFileRoute } from "@tanstack/react-router";
import { PolicyShell } from "./about";

export const Route = createFileRoute("/terms")({ component: () => (
  <PolicyShell title="이용약관">
    <p>본 약관은 URNOTALONE 서비스의 이용 조건과 절차, 회사와 사용자의 권리·의무·책임을 규정합니다.</p>
    <p>(데모 표기) 정식 약관은 베타 종료 후 게시됩니다.</p>
  </PolicyShell>
)});
