import { ErrorState } from "@/components/ui/error-state";
import { RefundDetailView } from "@/features/refunds/components/refund-detail-view";
import { getRefundDetailSnapshot } from "@/features/refunds/lib/refund-detail";
import {
  adminUsers,
  auditEvents,
  customers,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

type AdminRefundDetailPageProps = {
  params: Promise<{
    refundId: string;
  }>;
};

export default async function AdminRefundDetailPage({
  params,
}: AdminRefundDetailPageProps) {
  const { refundId } = await params;

  const snapshot = getRefundDetailSnapshot({
    adminUsers,
    auditEvents,
    customers,
    payments,
    plans,
    refundId,
    refunds,
    subscriptions,
  });

  if (!snapshot) {
    return (
      <main className="flex flex-col gap-10">
        <ErrorState
          title="환불 요청을 찾을 수 없습니다"
          description="요청한 환불 ID가 목업 데이터에 없거나 이미 정리된 상태입니다. 환불 목록으로 돌아가 다른 요청을 선택해 주세요."
        />
      </main>
    );
  }

  return <RefundDetailView snapshot={snapshot} />;
}
