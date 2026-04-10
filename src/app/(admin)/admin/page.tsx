import { ErrorState } from "@/components/ui/error-state";
import { AdminCommandCenterView } from "@/features/admin-home/components/admin-command-center-view";
import { getAdminCommandCenterSnapshot } from "@/features/admin-home/lib/admin-command-center";
import {
  auditEvents,
  coupons,
  metricSnapshot,
  payments,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

export default function AdminPage() {
  const snapshot = getAdminCommandCenterSnapshot({
    auditEvents,
    coupons,
    metricSnapshot,
    payments,
    refunds,
    subscriptions,
  });

  if (!snapshot) {
    return (
      <main className="flex flex-col gap-10">
        <ErrorState
          title="운영 홈 화면을 구성할 수 없습니다"
          description="핵심 운영 지표나 작업 큐 데이터를 불러오지 못해 관리자 홈을 렌더링하지 못했습니다."
        />
      </main>
    );
  }

  return <AdminCommandCenterView snapshot={snapshot} />;
}
