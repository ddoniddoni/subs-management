import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function BillingPage() {
  return (
    <RoutePlaceholder
      eyebrow="고객 계정"
      title="결제 내역 페이지 골격"
      description="이 페이지는 고객이 청구 내역, 결제 시도, 실패 결제, 환불 관련 결제 이벤트를 확인하는 화면이 됩니다."
      bullets={[
        "재사용 가능한 결제 내역 테이블은 테이블 프리미티브 이후에 추가됩니다.",
        "목업 결제 데이터가 준비되기 전까지는 단순한 화면으로 유지합니다.",
        "이 경로는 고객 계정 영역을 초기에 명확히 잡기 위한 목적입니다.",
      ]}
    />
  );
}
