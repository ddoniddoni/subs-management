import { ErrorState } from "@/components/ui/error-state";
import { CustomerSubscriptionCenter } from "@/features/customer-account/components/customer-subscription-center";
import { getCustomerSubscriptionSnapshot } from "@/features/customer-account/lib/customer-account";
import {
  coupons,
  currentCustomerId,
  customers,
  invoices,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

export default function SubscriptionPage() {
  const snapshot = getCustomerSubscriptionSnapshot({
    coupons,
    customerId: currentCustomerId,
    customers,
    invoices,
    payments,
    plans,
    refunds,
    subscriptions,
  });

  if (!snapshot) {
    return (
      <main className="flex flex-col gap-10">
        <ErrorState
          title="구독 정보를 불러올 수 없습니다"
          description="현재 고객 세션에 연결된 구독 또는 플랜 정보가 없어 구독 센터를 구성하지 못했습니다."
        />
      </main>
    );
  }

  return <CustomerSubscriptionCenter snapshot={snapshot} />;
}
