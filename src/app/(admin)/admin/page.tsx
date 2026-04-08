import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";

export default function AdminPage() {
  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="운영 대시보드 개요"
        description="관리자 홈에서는 고객, 결제, 환불, 이슈 대응 현황을 빠르게 파악할 수 있어야 하므로 반복 사용 가능한 카드와 상태 블록이 중요합니다."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="활성 고객"
          value="1,284"
          description="실제 집계는 이후 목업 지표 스냅샷과 연결할 예정입니다."
        />
        <StatCard
          label="월간 반복 매출"
          value="₩38.4M"
          description="운영 대시보드에서 가장 먼저 보게 될 핵심 수치 중 하나입니다."
        />
        <StatCard
          label="결제 실패"
          value="32건"
          description="후속 단계에서 결제 재시도 흐름과 연결될 예정입니다."
        />
        <StatCard
          label="환불 대기"
          value="7건"
          description="승인 대기 상태의 건수를 바로 파악할 수 있어야 합니다."
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <LoadingSkeleton lines={5} />
        <ErrorState
          title="실시간 운영 피드는 아직 연결되지 않았습니다"
          description="다음 단계에서 이벤트 데이터와 감사 로그가 준비되면 운영 알림 패널과 최근 활동 피드를 이 영역에 연결합니다."
        />
      </section>
    </main>
  );
}
