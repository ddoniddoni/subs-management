import { RefundReviewBoard } from "@/features/refunds/components/refund-review-board";
import { auditEvents, customers, payments, refunds } from "@/mocks/subscription-data";

export default function AdminRefundsPage() {
  return (
    <RefundReviewBoard
      auditEvents={auditEvents}
      customers={customers}
      payments={payments}
      refunds={refunds}
    />
  );
}
