import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminUsersPage() {
  return (
    <RoutePlaceholder
      eyebrow="관리자 운영"
      title="관리자 사용자 페이지 골격"
      description="이 화면은 내부 운영자 목록, 역할, 권한 가시성을 보여주는 관리자 화면이 됩니다."
      bullets={[
        "역할 배지와 권한 요약은 이후 단계에서 추가됩니다.",
        "초기 제품 스토리에서는 읽기 전용 버전만으로도 충분합니다.",
        "이제 역할 기반 내비게이션을 다음 단계에서 자연스럽게 얹을 수 있습니다.",
      ]}
    />
  );
}
