import { createFileRoute } from "@tanstack/react-router";
import { PolicyShell } from "./about";

export const Route = createFileRoute("/privacy")({ component: () => (
  <PolicyShell title="개인정보 처리방침">
    <p>본 서비스는 만 14세 미만 아동의 정보를 다루며, 한국 개인정보보호법 및 정보통신망법에 따라 법정대리인 동의를 필수로 합니다.</p>
    <p>수집 항목, 이용 목적, 보유 기간, 제3자 제공 여부, 동의 철회 절차 등은 시행 전 별도의 정식 정책 문서에서 확정합니다. (데모 표시)</p>
  </PolicyShell>
)});
