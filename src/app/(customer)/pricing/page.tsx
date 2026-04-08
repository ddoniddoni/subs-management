import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function PricingPage() {
  return (
    <RoutePlaceholder
      eyebrow="고객용 화면"
      title="요금제 페이지 골격"
      description="이 화면은 예비 고객이 구독 플랜, 결제 주기, 플랜별 가치를 비교하는 공간이 됩니다."
      bullets={[
        "플랜 카드와 기능 비교 UI는 다음 단계에서 추가됩니다.",
        "지금은 고객용 라우트 지도를 먼저 고정하기 위해 이 페이지를 마련했습니다.",
        "공통 레이아웃과 UI 프리미티브가 준비되기 전까지는 단순한 구조를 유지합니다.",
      ]}
    />
  );
}
