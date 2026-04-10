import { ErrorState } from "@/components/ui/error-state";
import { PaymentDetailView } from "@/features/payments/components/payment-detail-view";
import { getPaymentDetailSnapshot } from "@/features/payments/lib/payment-detail";
import {
  adminUsers,
  auditEvents,
  customers,
  invoices,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

type AdminPaymentDetailPageProps = {
  params: Promise<{
    paymentId: string;
  }>;
};

export default async function AdminPaymentDetailPage({
  params,
}: AdminPaymentDetailPageProps) {
  const { paymentId } = await params;

  const snapshot = getPaymentDetailSnapshot({
    adminUsers,
    auditEvents,
    customers,
    invoices,
    paymentId,
    payments,
    plans,
    refunds,
    subscriptions,
  });

  if (!snapshot) {
    return (
      <main className="flex flex-col gap-10">
        <ErrorState
          title="결제 건을 찾을 수 없습니다"
          description="요청한 결제 ID가 목업 데이터에 없거나 이미 정리된 상태입니다. 결제 목록으로 돌아가 다른 결제 건을 선택해 주세요."
        />
      </main>
    );
  }

  return <PaymentDetailView snapshot={snapshot} />;
}
