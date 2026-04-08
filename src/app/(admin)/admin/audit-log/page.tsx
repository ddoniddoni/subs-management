import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AuditLogPage() {
  return (
    <RoutePlaceholder
      eyebrow="관리자 운영"
      title="감사 로그 페이지 골격"
      description="이 경로는 구독 변경, 환불 처리, 쿠폰 액션, 결제 개입 이력을 추적하는 화면이 됩니다."
      bullets={[
        "필터링과 이벤트 타임라인은 이후 단계에서 구현합니다.",
        "이 플레이스홀더는 초기 관리자 구조에서 감사 로그 경로를 고정합니다.",
        "다음 작업에서는 목업 감사 이벤트와 관련 리소스를 연결할 예정입니다.",
      ]}
    />
  );
}
