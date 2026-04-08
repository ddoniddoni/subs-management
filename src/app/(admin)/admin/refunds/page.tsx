import { RefundReviewBoard } from "@/features/refunds/components/refund-review-board";
import { customers, payments, refunds } from "@/mocks/subscription-data";

export default function AdminRefundsPage() {
  return (
    <RefundReviewBoard
      customers={customers}
      payments={payments}
      refunds={refunds}
    />
  );
}
