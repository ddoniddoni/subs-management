import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function Home() {
  return (
    <RoutePlaceholder
      eyebrow="고객용 화면"
      title="랜딩 페이지 골격"
      description="이 홈 화면은 구독 제품을 소개하고 비즈니스 맥락을 전달한 뒤, 방문자를 요금제 선택으로 자연스럽게 안내하게 됩니다."
      bullets={[
        "부트스트랩 단계에서는 마케팅 서사를 과하게 확장하지 않습니다.",
        "이 경로는 제품의 공개 진입점을 먼저 고정하는 역할을 합니다.",
        "다음 단계에서 고객용 공통 섹션과 더 풍부한 콘텐츠가 추가됩니다.",
      ]}
    />
  );
}
