import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { BillingHistoryWorkbench } from "@/features/customer-account/components/billing-history-workbench";
import { getCustomerBillingSnapshot } from "@/features/customer-account/lib/customer-account";
import {
  currentCustomerId,
  customers,
  invoices,
  payments,
  refunds,
} from "@/mocks/subscription-data";

export default function BillingPage() {
  const snapshot = getCustomerBillingSnapshot({
    customerId: currentCustomerId,
    customers,
    invoices,
    payments,
    refunds,
  });

  if (!snapshot) {
    return (
      <main className="flex flex-col gap-10">
        <ErrorState
          title="결제 내역을 불러올 수 없습니다"
          description="현재 고객 세션에 연결된 청구 데이터가 없어 결제 내역 화면을 구성하지 못했습니다."
        />
      </main>
    );
  }

  if (snapshot.rows.length === 0) {
    return (
      <main className="flex flex-col gap-10">
        <EmptyState
          title="표시할 결제 이력이 없습니다"
          description="첫 결제가 완료되면 이 화면에서 청구 번호, 결제 상태, 결제 수단을 함께 확인할 수 있습니다."
        />
      </main>
    );
  }

  return <BillingHistoryWorkbench snapshot={snapshot} />;
}
