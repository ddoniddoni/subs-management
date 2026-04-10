import { ErrorState } from "@/components/ui/error-state";
import { CustomerDetailView } from "@/features/customers/components/customer-detail-view";
import { getCustomerDetailSnapshot } from "@/features/customers/lib/customer-detail";
import {
  adminUsers,
  auditEvents,
  coupons,
  customers,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

type AdminCustomerDetailPageProps = {
  params: Promise<{
    customerId: string;
  }>;
};

export default async function AdminCustomerDetailPage({
  params,
}: AdminCustomerDetailPageProps) {
  const { customerId } = await params;

  const snapshot = getCustomerDetailSnapshot({
    customerId,
    customers,
    subscriptions,
    plans,
    payments,
    refunds,
    coupons,
    auditEvents,
    adminUsers,
  });

  if (!snapshot) {
    return (
      <main className="flex flex-col gap-10">
        <ErrorState
          title="고객 정보를 찾을 수 없습니다"
          description="요청한 고객 ID가 목업 데이터에 없거나 삭제된 상태입니다. 고객 목록으로 돌아가 다른 계정을 선택해 주세요."
        />
      </main>
    );
  }

  return <CustomerDetailView snapshot={snapshot} />;
}
