import { EmptyState } from "@/components/ui/empty-state";
import { PricingPlanExplorer } from "@/features/customer-acquisition/components/pricing-plan-explorer";
import { getCustomerAcquisitionSnapshot } from "@/features/customer-acquisition/lib/customer-acquisition";
import { plans } from "@/mocks/subscription-data";

export default function PricingPage() {
  if (plans.length === 0) {
    return (
      <main className="flex flex-col gap-10">
        <EmptyState
          title="비교할 요금제가 없습니다"
          description="플랜이 준비되면 billing interval 비교와 checkout 진입 CTA를 이 화면에 표시합니다."
        />
      </main>
    );
  }

  const snapshot = getCustomerAcquisitionSnapshot(plans);

  return <PricingPlanExplorer snapshot={snapshot} />;
}
