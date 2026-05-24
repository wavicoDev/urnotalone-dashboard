import { createFileRoute } from "@tanstack/react-router";
import { PolicyShell } from "./about";

export const Route = createFileRoute("/governance")({ component: () => (
  <PolicyShell title="데이터 거버넌스 · 만 14세 미만 정책">
    <p>
      <strong>대화 원문은 수집·저장·노출하지 않습니다.</strong> EmotionLog 스키마 자체에 원문 필드가 존재하지 않으며,
      추출된 감정 라벨·활동 카테고리·수위·통계만 보관됩니다.
    </p>
    <p>
      교사가 학생의 신호 상세를 보기 위해서는 보호자의 별도 동의(<code>teacher_visibility</code>)가 필요합니다.
      미동의 학생은 교사 대시보드에 익명 코드로만 표시됩니다.
    </p>
    <p>
      위기 알림 본문은 "친구 관계의 어려움", "정서 표현이 평소와 달라요" 수준의 추상적 메시지로 통일됩니다.
      Lv.3(자해·학대)는 외부 자원(1393·117) 연결 화면을 보호자에게 강제 노출합니다.
    </p>
    <p>동의 철회 시 30일 이내 모든 관련 데이터를 삭제합니다.</p>
  </PolicyShell>
)});
