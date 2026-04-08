import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function CheckoutPage() {
  return (
    <RoutePlaceholder
      eyebrow="고객용 화면"
      title="체크아웃 흐름 골격"
      description="이 경로는 선택한 플랜 정보, 고객 입력, 결제 완료 상태를 포함한 목업 체크아웃 흐름을 담당하게 됩니다."
      bullets={[
        "실제 결제 처리는 현재 부트스트랩 범위에 포함하지 않습니다.",
        "이 플레이스홀더는 포트폴리오 제품 흐름을 위해 경로를 먼저 확보합니다.",
        "폼 구조와 검증은 공통 UI 레이어가 준비된 뒤 추가됩니다.",
      ]}
    />
  );
}
