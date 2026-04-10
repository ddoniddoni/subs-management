import { adminRoleLabel, couponStatusMeta, paymentStatusMeta, refundStatusMeta, subscriptionStatusMeta } from "@/lib/domain-meta";
import { formatCurrency } from "@/lib/format";
import type {
  AdminUser,
  AuditEvent,
  Coupon,
  Customer,
  Payment,
  Plan,
  Refund,
  Subscription,
} from "@/types/domain";

type CustomerDetailSnapshotInput = {
  adminUsers: AdminUser[];
  auditEvents: AuditEvent[];
  coupons: Coupon[];
  customerId: string;
  customers: Customer[];
  payments: Payment[];
  plans: Plan[];
  refunds: Refund[];
  subscriptions: Subscription[];
};

type CustomerDetailSnapshot = {
  activityItems: {
    actorLabel: string;
    id: string;
    occurredAt: string;
    summary: string;
  }[];
  coupons: Coupon[];
  customer: Customer;
  payments: Payment[];
  refunds: Refund[];
  stats: {
    activeCouponCount: string;
    refundAmount: string;
    totalPayments: string;
    unresolvedPaymentCount: string;
  };
  subscription: (Subscription & { plan: Plan | null }) | null;
};

export function getCustomerDetailSnapshot({
  adminUsers,
  auditEvents,
  coupons,
  customerId,
  customers,
  payments,
  plans,
  refunds,
  subscriptions,
}: CustomerDetailSnapshotInput): CustomerDetailSnapshot | null {
  const customer = customers.find((item) => item.id === customerId);

  if (!customer) {
    return null;
  }

  const subscriptionRecord =
    subscriptions.find((item) => item.customerId === customer.id) ?? null;
  const subscription = subscriptionRecord
    ? {
        ...subscriptionRecord,
        plan: plans.find((plan) => plan.id === subscriptionRecord.planId) ?? null,
      }
    : null;

  const relatedPayments = payments
    .filter((item) => item.customerId === customer.id)
    .toSorted((a, b) => b.attemptedAt.localeCompare(a.attemptedAt));
  const relatedRefunds = refunds
    .filter((item) => item.customerId === customer.id)
    .toSorted((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  const relatedCoupons = coupons
    .filter((item) => item.assignedCustomerId === customer.id)
    .toSorted((a, b) => b.expiresAt.localeCompare(a.expiresAt));

  const relatedTargetIds = new Set<string>([
    customer.id,
    ...relatedPayments.map((item) => item.id),
    ...relatedRefunds.map((item) => item.id),
    ...relatedCoupons.map((item) => item.id),
    ...(subscription ? [subscription.id] : []),
  ]);

  const relatedActivityItems = auditEvents
    .filter((event) => relatedTargetIds.has(event.targetId))
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

  const totalPayments = relatedPayments
    .filter((item) => item.status === "paid" || item.status === "refunded")
    .reduce((total, item) => total + item.amount, 0);
  const refundAmount = relatedRefunds.reduce((total, item) => total + item.amount, 0);
  const unresolvedPaymentCount = relatedPayments.filter(
    (item) => item.status === "failed" || item.status === "pending",
  ).length;
  const activeCouponCount = relatedCoupons.filter(
    (item) => item.status === "active" || item.status === "scheduled",
  ).length;

  return {
    customer,
    subscription,
    payments: relatedPayments,
    refunds: relatedRefunds,
    coupons: relatedCoupons,
    activityItems: relatedActivityItems,
    stats: {
      totalPayments: formatCurrency(totalPayments),
      refundAmount: formatCurrency(refundAmount),
      unresolvedPaymentCount: `${unresolvedPaymentCount}건`,
      activeCouponCount: `${activeCouponCount}건`,
    },
  };
}

export { couponStatusMeta, paymentStatusMeta, refundStatusMeta, subscriptionStatusMeta };
export type { CustomerDetailSnapshot };
