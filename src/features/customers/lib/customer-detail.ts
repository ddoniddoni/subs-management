import {
  buildAdminDetailActivityItems,
  findSubscriptionWithPlanByCustomerId,
  sortCouponsByExpiresAt,
  sortPaymentsByAttemptedAt,
  sortRefundsByRequestedAt,
  type AdminDetailActivityItem,
  type SubscriptionWithPlan,
} from "@/lib/admin-detail-composition";
import {
  couponStatusMeta,
  paymentStatusMeta,
  refundStatusMeta,
  subscriptionStatusMeta,
} from "@/lib/domain-meta";
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
  activityItems: AdminDetailActivityItem[];
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
  subscription: SubscriptionWithPlan | null;
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

  const subscription = findSubscriptionWithPlanByCustomerId({
    customerId: customer.id,
    plans,
    subscriptions,
  });
  const relatedPayments = sortPaymentsByAttemptedAt(
    payments.filter((item) => item.customerId === customer.id),
  );
  const relatedRefunds = sortRefundsByRequestedAt(
    refunds.filter((item) => item.customerId === customer.id),
  );
  const relatedCoupons = sortCouponsByExpiresAt(
    coupons.filter((item) => item.assignedCustomerId === customer.id),
  );

  const relatedTargetIds = new Set<string>([
    customer.id,
    ...relatedPayments.map((item) => item.id),
    ...relatedRefunds.map((item) => item.id),
    ...relatedCoupons.map((item) => item.id),
    ...(subscription ? [subscription.id] : []),
  ]);

  const relatedActivityItems = buildAdminDetailActivityItems({
    adminUsers,
    auditEvents,
    targetIds: relatedTargetIds,
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
