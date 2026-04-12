import {
  buildAdminDetailActivityItems,
  findSubscriptionWithPlanBySubscriptionId,
  sortRefundsByRequestedAt,
  type AdminDetailActivityItem,
  type SubscriptionWithPlan,
} from "@/lib/admin-detail-composition";
import {
  paymentStatusMeta,
  refundStatusMeta,
  subscriptionStatusMeta,
} from "@/lib/domain-meta";
import { formatCurrency } from "@/lib/format";
import type {
  AdminUser,
  AuditEvent,
  Customer,
  Invoice,
  Payment,
  Plan,
  Refund,
  Subscription,
} from "@/types/domain";

type PaymentDetailSnapshotInput = {
  adminUsers: AdminUser[];
  auditEvents: AuditEvent[];
  customers: Customer[];
  invoices: Invoice[];
  paymentId: string;
  payments: Payment[];
  plans: Plan[];
  refunds: Refund[];
  subscriptions: Subscription[];
};

type PaymentDetailSnapshot = {
  activityItems: AdminDetailActivityItem[];
  customer: Customer | null;
  invoice: Invoice | null;
  payment: Payment;
  refunds: Refund[];
  stats: {
    amount: string;
    relatedRefundCount: string;
    refundTotal: string;
    reviewedState: string;
  };
  subscription: SubscriptionWithPlan | null;
};

export function getPaymentDetailSnapshot({
  adminUsers,
  auditEvents,
  customers,
  invoices,
  paymentId,
  payments,
  plans,
  refunds,
  subscriptions,
}: PaymentDetailSnapshotInput): PaymentDetailSnapshot | null {
  const payment = payments.find((item) => item.id === paymentId);

  if (!payment) {
    return null;
  }

  const customer = customers.find((item) => item.id === payment.customerId) ?? null;
  const invoice = invoices.find((item) => item.id === payment.invoiceId) ?? null;
  const subscription = findSubscriptionWithPlanBySubscriptionId({
    plans,
    subscriptionId: payment.subscriptionId,
    subscriptions,
  });
  const relatedRefunds = sortRefundsByRequestedAt(
    refunds.filter((item) => item.paymentId === payment.id),
  );

  const activityItems = buildAdminDetailActivityItems({
    adminUsers,
    auditEvents,
    targetIds: new Set<string>([
      payment.id,
      ...relatedRefunds.map((item) => item.id),
    ]),
  });

  const refundTotal = relatedRefunds.reduce((total, item) => total + item.amount, 0);

  return {
    payment,
    customer,
    invoice,
    subscription,
    refunds: relatedRefunds,
    activityItems,
    stats: {
      amount: formatCurrency(payment.amount),
      relatedRefundCount: `${relatedRefunds.length}건`,
      refundTotal: formatCurrency(refundTotal),
      reviewedState:
        relatedRefunds.length > 0
          ? "환불 이력 연결됨"
          : payment.status === "failed"
            ? "추가 대응 필요"
            : "연결 환불 없음",
    },
  };
}

export { paymentStatusMeta, refundStatusMeta, subscriptionStatusMeta };
export type { PaymentDetailSnapshot };
