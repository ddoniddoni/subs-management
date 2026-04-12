import {
  buildAdminDetailActivityItems,
  findSubscriptionWithPlanBySubscriptionId,
  type AdminDetailActivityItem,
  type SubscriptionWithPlan,
} from "@/lib/admin-detail-composition";
import { refundStatusMeta, subscriptionStatusMeta } from "@/lib/domain-meta";
import { formatCurrency } from "@/lib/format";
import type {
  AdminUser,
  AuditEvent,
  Customer,
  Payment,
  Plan,
  Refund,
  Subscription,
} from "@/types/domain";

type RefundDetailSnapshotInput = {
  adminUsers: AdminUser[];
  auditEvents: AuditEvent[];
  customers: Customer[];
  payments: Payment[];
  plans: Plan[];
  refundId: string;
  refunds: Refund[];
  subscriptions: Subscription[];
};

type RefundDetailSnapshot = {
  activityItems: AdminDetailActivityItem[];
  customer: Customer | null;
  payment: Payment | null;
  refund: Refund;
  stats: {
    refundAmount: string;
    reviewedState: string;
  };
  subscription: SubscriptionWithPlan | null;
};

export function getRefundDetailSnapshot({
  adminUsers,
  auditEvents,
  customers,
  payments,
  plans,
  refundId,
  refunds,
  subscriptions,
}: RefundDetailSnapshotInput): RefundDetailSnapshot | null {
  const refund = refunds.find((item) => item.id === refundId);

  if (!refund) {
    return null;
  }

  const customer = customers.find((item) => item.id === refund.customerId) ?? null;
  const payment = payments.find((item) => item.id === refund.paymentId) ?? null;
  const subscription = findSubscriptionWithPlanBySubscriptionId({
    plans,
    subscriptionId: payment?.subscriptionId,
    subscriptions,
  });

  const activityItems = buildAdminDetailActivityItems({
    adminUsers,
    auditEvents,
    entityType: "refund",
    targetIds: new Set<string>([refund.id]),
  });

  return {
    refund,
    customer,
    payment,
    subscription,
    activityItems,
    stats: {
      refundAmount: formatCurrency(refund.amount),
      reviewedState:
        refund.status === "requested"
          ? "검토 대기"
          : refund.reviewedAt
            ? "검토 완료"
            : "처리 상태 미확인",
    },
  };
}

export { refundStatusMeta, subscriptionStatusMeta };
export type { RefundDetailSnapshot };
