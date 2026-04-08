import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminPaymentsPage() {
  return (
    <RoutePlaceholder
      eyebrow="관리자 운영"
      title="결제 페이지 골격"
      description="이 경로는 결제 모니터링, 실패 처리, 관련 고객 및 구독 기록으로의 이동을 담당하게 됩니다."
      bullets={[
        "결제 테이블과 재시도 워크플로우는 의도적으로 뒤 단계로 미뤘습니다.",
        "관리자 결제 영역을 초기에 고정하기 위해 먼저 경로를 만들었습니다.",
        "목업 결제 데이터는 다음 부트스트랩 단계에서 추가됩니다.",
      ]}
    />
  );
}
