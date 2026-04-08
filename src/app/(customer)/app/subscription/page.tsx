import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";

export default function SubscriptionPage() {
  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="고객 계정"
        title="내 구독"
        description="실제 구독 데이터 연결 전 단계에서, 고객이 보게 될 핵심 정보 배치와 상태 표현 방식을 먼저 구성한 화면입니다."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label="활성" tone="success" />
          <StatusBadge label="월간 플랜" tone="info" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard
            label="현재 플랜"
            value="프로 플랜"
            description="관리 기능과 고객용 셀프서비스 흐름을 모두 사용할 수 있는 기준 플랜입니다."
          />
          <StatCard
            label="다음 결제일"
            value="4월 30일"
            description="실제 날짜 계산은 Step 04에서 목업 구독 데이터와 연결할 예정입니다."
          />
          <StatCard
            label="최근 변경"
            value="업그레이드"
            description="상태 변경 이력과 활동 요약은 이후 계정 화면에서 더 구체화됩니다."
          />
        </div>
      </section>
    </main>
  );
}
