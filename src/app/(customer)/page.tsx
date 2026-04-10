import { EmptyState } from "@/components/ui/empty-state";
import { CustomerLandingPageView } from "@/features/customer-acquisition/components/customer-landing-page-view";
import { getCustomerAcquisitionSnapshot } from "@/features/customer-acquisition/lib/customer-acquisition";
import { plans } from "@/mocks/subscription-data";

export default function Home() {
  if (plans.length === 0) {
    return (
      <main className="flex flex-col gap-10">
        <EmptyState
          title="도입 가능한 플랜이 아직 준비되지 않았습니다"
          description="요금제 구성이 정리되면 랜딩 페이지에서 추천 플랜과 checkout 흐름을 함께 안내합니다."
        />
      </main>
    );
  }

  const snapshot = getCustomerAcquisitionSnapshot(plans);

  return <CustomerLandingPageView snapshot={snapshot} />;
}
