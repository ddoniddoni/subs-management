import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminCouponsPage() {
  return (
    <RoutePlaceholder
      eyebrow="관리자 운영"
      title="쿠폰 페이지 골격"
      description="이 경로는 리텐션과 고객 지원 흐름에 연결된 프로모션을 발급하고 검토하고 회수하는 화면이 됩니다."
      bullets={[
        "쿠폰 생성과 회수 흐름은 다음 단계에서 구현할 예정입니다.",
        "제품 계획에 맞춰 관리자 라우트 구조를 먼저 반영하기 위해 이 페이지를 확보했습니다.",
        "이후 작업에서 이 화면을 재사용 가능한 폼과 테이블 컴포넌트에 연결합니다.",
      ]}
    />
  );
}
