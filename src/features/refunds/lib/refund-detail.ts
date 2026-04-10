import { adminRoleLabel, refundStatusMeta, subscriptionStatusMeta } from "@/lib/domain-meta";
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
  activityItems: {
    actorLabel: string;
    id: string;
    occurredAt: string;
    summary: string;
  }[];
  customer: Customer | null;
  payment: Payment | null;
  refund: Refund;
  stats: {
    refundAmount: string;
    reviewedState: string;
  };
  subscription: (Subscription & { plan: Plan | null }) | null;
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
  const subscriptionRecord = payment
    ? subscriptions.find((item) => item.id === payment.subscriptionId) ?? null
    : null;
  const subscription = subscriptionRecord
    ? {
        ...subscriptionRecord,
        plan: plans.find((item) => item.id === subscriptionRecord.planId) ?? null,
      }
    : null;

  const activityItems = auditEvents
    .filter((event) => event.entityType === "refund" && event.targetId === refund.id)
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((event) => {
      const actor = adminUsers.find((item) => item.id === event.actorAdminUserId);

      return {
        id: event.id,
        occurredAt: event.createdAt,
        summary: event.summary,
        actorLabel: actor
          ? `${actor.name} · ${adminRoleLabel[actor.role]}`
          : "관리자 정보 미확인",
      };
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
