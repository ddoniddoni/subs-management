import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminAnalyticsPage() {
  return (
    <RoutePlaceholder
      eyebrow="관리자 운영"
      title="분석 페이지 골격"
      description="이 경로는 매출, 구독 상태, 이탈, 결제 실패, 환불 추이를 보여주는 운영 분석 화면이 됩니다."
      bullets={[
        "차트는 지표 스냅샷 모델이 준비된 뒤에 추가합니다.",
        "이 플레이스홀더는 관리자 콘솔의 분석 영역을 먼저 확보하는 역할을 합니다.",
        "실제 구현은 장식보다 운영 인사이트 전달에 집중할 예정입니다.",
      ]}
    />
  );
}
