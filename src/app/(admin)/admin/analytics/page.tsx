import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { AnalyticsDashboardView } from "@/features/analytics/components/analytics-dashboard-view";
import { getAnalyticsDashboardSnapshot } from "@/features/analytics/lib/analytics-dashboard";
import {
  coupons,
  customers,
  metricSnapshots,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

export default function AdminAnalyticsPage() {
  if (metricSnapshots.length === 0) {
    return (
      <main className="flex flex-col gap-10">
        <EmptyState
          title="분석 데이터가 아직 없습니다"
          description="metric snapshot 시계열이 준비되면 KPI와 추이 차트가 이 화면에 표시됩니다."
        />
      </main>
    );
  }

  const snapshot = getAnalyticsDashboardSnapshot({
    coupons,
    customers,
    metricSnapshots,
    payments,
    plans,
    refunds,
    subscriptions,
  });

  if (!snapshot) {
    return (
      <main className="flex flex-col gap-10">
        <ErrorState
          title="분석 대시보드를 구성할 수 없습니다"
          description="핵심 metric snapshot이나 운영 데이터가 누락되어 분석 화면을 그릴 수 없습니다."
        />
      </main>
    );
  }

  return <AnalyticsDashboardView snapshot={snapshot} />;
}
