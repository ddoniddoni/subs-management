import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";

export default function Home() {
  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="고객용 화면"
        title="구독 서비스를 위한 안정적인 시작점"
        description="랜딩 페이지의 실제 마케팅 콘텐츠를 넣기 전 단계로, 고객이 어떤 제품을 보게 될지와 핵심 흐름이 무엇인지 먼저 정리해둔 화면입니다."
      />

      <section className="flex flex-wrap items-center gap-3">
        <StatusBadge label="고객용 웹" tone="info" />
        <StatusBadge label="체크아웃 목업 예정" tone="warning" />
        <StatusBadge label="한글 UI 기준" tone="success" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="핵심 흐름"
          value="3단계"
          description="소개, 요금제 비교, 체크아웃 흐름으로 이어지는 고객 여정을 우선 구성합니다."
        />
        <StatCard
          label="계정 화면"
          value="2개"
          description="내 구독과 결제 내역 화면을 통해 실제 사용 후 경험까지 연결합니다."
        />
        <StatCard
          label="제품 원칙"
          value="운영 중심"
          description="화려한 마케팅보다 실제 운영 제품과 연결되는 설득력을 우선합니다."
        />
      </section>

      <EmptyState
        title="랜딩 콘텐츠는 다음 단계에서 채워집니다"
        description="현재는 제품 구조와 공통 UI 기반을 먼저 잡는 단계라서, 소개 섹션과 FAQ, 고객 후기 같은 마케팅 블록은 아직 비워두었습니다."
      />
    </main>
  );
}
