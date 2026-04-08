import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminRefundsPage() {
  return (
    <RoutePlaceholder
      eyebrow="관리자 운영"
      title="환불 페이지 골격"
      description="이 페이지는 내부 운영자가 환불 요청을 검토하고 승인 또는 반려하는 흐름을 담당하게 됩니다."
      bullets={[
        "승인 액션 자체는 Step 02 범위에서 구현하지 않습니다.",
        "환불 워크플로우를 위한 전용 화면을 먼저 확보해둔 상태입니다.",
        "사유 입력과 감사 이벤트는 공통 액션 패턴이 생긴 뒤 추가됩니다.",
      ]}
    />
  );
}
