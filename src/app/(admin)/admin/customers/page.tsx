import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminCustomersPage() {
  return (
    <RoutePlaceholder
      eyebrow="관리자 운영"
      title="고객 페이지 골격"
      description="이 화면은 구독 상태 전반에 걸쳐 고객을 검색하고 필터링하고 검토하는 핵심 운영 테이블이 됩니다."
      bullets={[
        "정렬 가능한 테이블과 필터는 다음 단계에서 추가됩니다.",
        "앱 구조를 다시 흔들지 않고 고객 운영 화면을 확장할 수 있도록 경로를 먼저 만들었습니다.",
        "고객 상세 화면은 다음 도메인 모델링 단계와 함께 발전시킬 예정입니다.",
      ]}
    />
  );
}
