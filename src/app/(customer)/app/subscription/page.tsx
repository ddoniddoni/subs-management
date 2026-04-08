import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function SubscriptionPage() {
  return (
    <RoutePlaceholder
      eyebrow="고객 계정"
      title="내 구독 페이지 골격"
      description="이 페이지는 로그인한 고객에게 현재 플랜, 구독 상태, 갱신 시점, 최근 계정 활동을 보여주는 공간이 됩니다."
      bullets={[
        "구독 상태 배지는 다음 단계에서 추가됩니다.",
        "계정 화면을 점진적으로 연결할 수 있도록 먼저 경로를 마련했습니다.",
        "이후 작업에서 공통 구독 도메인 모델과 이 페이지를 연결할 예정입니다.",
      ]}
    />
  );
}
