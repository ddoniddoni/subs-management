import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminPage() {
  return (
    <RoutePlaceholder
      eyebrow="관리자 운영"
      title="관리자 개요 페이지 골격"
      description="이 경로는 KPI, 알림, 결제 상태, 환불 대기 현황을 한눈에 보는 운영 홈 화면이 됩니다."
      bullets={[
        "대시보드 카드와 차트는 이후 부트스트랩 단계에서 추가됩니다.",
        "지금은 관리자 정보 구조를 먼저 고정하기 위해 이 경로를 확보했습니다.",
        "이제 더 깊은 운영 화면으로 이동할 수 있는 공통 관리자 내비게이션이 있습니다.",
      ]}
    />
  );
}
