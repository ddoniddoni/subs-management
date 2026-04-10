import {
  couponStatusMeta,
  paymentStatusMeta,
  subscriptionStatusMeta,
  type BadgeTone,
} from "@/lib/domain-meta";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import type {
  Coupon,
  Customer,
  Invoice,
  Payment,
  PaymentStatus,
  Plan,
  Refund,
  Subscription,
} from "@/types/domain";

export type CustomerAccountStatCard = {
  label: string;
  value: string;
  description: string;
};

export type CustomerTimelineItem = {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  tone: BadgeTone;
};

export type CustomerActionCard = {
  title: string;
  description: string;
  href: string;
  hrefLabel: string;
  tone: BadgeTone;
};

export type CustomerSubscriptionSnapshot = {
  customer: Customer;
  plan: Plan;
  subscription: Subscription;
  activeCoupon: Coupon | null;
  statusLabel: string;
  statusTone: BadgeTone;
  headlineCards: CustomerAccountStatCard[];
  timeline: CustomerTimelineItem[];
  actions: CustomerActionCard[];
  billingHealthMessage: string;
  recentBillingLabel: string;
};

export type CustomerBillingRow = {
  invoiceId: string;
  invoiceNumber: string;
  amountLabel: string;
  amountValue: number;
  status: PaymentStatus;
  statusLabel: string;
  statusTone: BadgeTone;
  issuedAtLabel: string;
  issuedAtValue: string;
  attemptedAtLabel: string;
  attemptedAtValue: string;
  methodLabel: string;
  summary: string;
};

export type CustomerBillingSnapshot = {
  customer: Customer;
  headlineCards: CustomerAccountStatCard[];
  rows: CustomerBillingRow[];
  issuePanel: {
    title: string;
    description: string;
    tone: BadgeTone;
  } | null;
};

export type BillingHistoryFilters = {
  query: string;
  status: PaymentStatus | "all";
  sortBy: "latest" | "amount";
};

function getStatusSummary(status: PaymentStatus) {
  if (status === "failed") {
    return "최근 결제에 실패가 있어 결제 수단 점검이 필요합니다.";
  }

  if (status === "refunded") {
    return "최근 청구에 환불 처리된 건이 있습니다.";
  }

  if (status === "pending") {
    return "최근 청구가 처리 중입니다.";
  }

  return "최근 청구가 정상적으로 완료되었습니다.";
}

export function getCustomerSubscriptionSnapshot({
  coupons,
  customerId,
  customers,
  invoices,
  payments,
  plans,
  refunds,
  subscriptions,
}: {
  coupons: Coupon[];
  customerId: string;
  customers: Customer[];
  invoices: Invoice[];
  payments: Payment[];
  plans: Plan[];
  refunds: Refund[];
  subscriptions: Subscription[];
}) {
  const customer = customers.find((item) => item.id === customerId);
  const subscription = subscriptions.find((item) => item.customerId === customerId);

  if (!customer || !subscription) {
    return null;
  }

  const plan = plans.find((item) => item.id === subscription.planId);

  if (!plan) {
    return null;
  }

  const activeCoupon =
    coupons.find(
      (item) => item.assignedCustomerId === customerId && item.status === "active",
    ) ?? null;
  const customerInvoices = invoices.filter(
    (invoice) => invoice.subscriptionId === subscription.id,
  );
  const customerPayments = payments
    .filter((payment) => payment.customerId === customerId)
    .sort((left, right) => right.attemptedAt.localeCompare(left.attemptedAt));
  const latestPayment = customerPayments[0] ?? null;
  const latestRefund =
    refunds
      .filter((refund) => refund.customerId === customerId)
      .sort((left, right) => right.requestedAt.localeCompare(left.requestedAt))[0] ?? null;
  const statusMeta = subscriptionStatusMeta[subscription.status];

  const timeline: CustomerTimelineItem[] = [
    {
      id: "subscription_started",
      title: `${plan.name} 구독 시작`,
      description: `${customer.company} 워크스페이스가 ${subscription.seats}석 규모로 시작되었습니다.`,
      dateLabel: formatDate(subscription.startedAt),
      tone: "info",
    },
    ...(activeCoupon
      ? [
          {
            id: `coupon_${activeCoupon.id}`,
            title: `${activeCoupon.code} 혜택 적용 중`,
            description: `${activeCoupon.title} 혜택이 ${formatDate(activeCoupon.expiresAt)}까지 적용됩니다.`,
            dateLabel: formatDate(activeCoupon.expiresAt),
            tone: couponStatusMeta[activeCoupon.status].tone,
          } satisfies CustomerTimelineItem,
        ]
      : []),
    ...(latestRefund
      ? [
          {
            id: `refund_${latestRefund.id}`,
            title: "최근 환불 처리",
            description: latestRefund.reason,
            dateLabel: formatDateTime(latestRefund.requestedAt),
            tone: "warning",
          } satisfies CustomerTimelineItem,
        ]
      : []),
    ...(subscription.nextBillingDate
      ? [
          {
            id: "next_billing",
            title: "다음 청구 예정",
            description: `${plan.name} ${subscription.seats}석 기준 청구가 예정되어 있습니다.`,
            dateLabel: formatDate(subscription.nextBillingDate),
            tone: latestPayment?.status === "failed" ? "danger" : "success",
          } satisfies CustomerTimelineItem,
        ]
      : []),
  ];

  const actions: CustomerActionCard[] = [
    {
      title: "결제 내역 확인",
      description: "최근 청구와 환불 상태를 직접 확인합니다.",
      href: "/app/billing",
      hrefLabel: "결제 내역 보기",
      tone: "info",
    },
    {
      title: "요금제 다시 비교",
      description: "팀 규모가 바뀌었다면 현재 플랜과 다른 옵션을 다시 검토합니다.",
      href: "/pricing",
      hrefLabel: "요금제 비교하기",
      tone: "neutral",
    },
    {
      title: "추가 워크스페이스 시작",
      description: "새 팀이나 새 브랜드를 위한 별도 구독을 checkout에서 시작합니다.",
      href: `/checkout?plan=${plan.code}`,
      hrefLabel: "checkout 열기",
      tone: "success",
    },
  ];

  return {
    customer,
    plan,
    subscription,
    activeCoupon,
    statusLabel: statusMeta.label,
    statusTone: statusMeta.tone,
    headlineCards: [
      {
        label: "현재 플랜",
        value: plan.name,
        description: plan.description,
      },
      {
        label: "다음 청구일",
        value: subscription.nextBillingDate
          ? formatDate(subscription.nextBillingDate)
          : "청구 일정 없음",
        description: `${subscription.seats}석 사용 중 · 시작일 ${formatDate(subscription.startedAt)}`,
      },
      {
        label: "최근 결제 상태",
        value: latestPayment ? paymentStatusMeta[latestPayment.status].label : "기록 없음",
        description: latestPayment
          ? `${formatDateTime(latestPayment.attemptedAt)} · ${latestPayment.methodLabel}`
          : "아직 결제 시도가 없습니다.",
      },
      {
        label: "적용 혜택",
        value: activeCoupon ? activeCoupon.title : "적용 쿠폰 없음",
        description: activeCoupon
          ? `${formatDate(activeCoupon.expiresAt)}까지 유지`
          : "현재 활성 할인 혜택이 없습니다.",
      },
    ],
    timeline,
    actions,
    billingHealthMessage: latestPayment
      ? getStatusSummary(latestPayment.status)
      : "최근 청구 기록이 없어 결제 건강도를 아직 계산할 수 없습니다.",
    recentBillingLabel:
      customerInvoices.length > 0
        ? `${customerInvoices.length}건의 청구 이력이 연결되어 있습니다.`
        : "연결된 청구 이력이 없습니다.",
  } satisfies CustomerSubscriptionSnapshot;
}

export function getCustomerBillingSnapshot({
  customerId,
  customers,
  invoices,
  payments,
  refunds,
}: {
  customerId: string;
  customers: Customer[];
  invoices: Invoice[];
  payments: Payment[];
  refunds: Refund[];
}) {
  const customer = customers.find((item) => item.id === customerId);

  if (!customer) {
    return null;
  }

  const rows = invoices
    .flatMap((invoice) => {
      const payment = payments.find((item) => item.invoiceId === invoice.id);

      if (!payment || payment.customerId !== customerId) {
        return [];
      }

      const linkedRefund = refunds.find((refund) => refund.paymentId === payment.id);

      return [
        {
          invoiceId: invoice.id,
          invoiceNumber: invoice.number,
          amountLabel: formatCurrency(invoice.amount),
          amountValue: invoice.amount,
          status: payment.status,
          statusLabel: paymentStatusMeta[payment.status].label,
          statusTone: paymentStatusMeta[payment.status].tone,
          issuedAtLabel: formatDate(invoice.issuedAt),
          issuedAtValue: invoice.issuedAt,
          attemptedAtLabel: formatDateTime(payment.attemptedAt),
          attemptedAtValue: payment.attemptedAt,
          methodLabel: payment.methodLabel,
          summary:
            linkedRefund && payment.status === "refunded"
              ? `환불 처리 완료 · ${linkedRefund.reason}`
              : payment.status === "failed"
                ? "결제 실패 · 수단 점검 필요"
                : payment.status === "pending"
                  ? "처리 중"
                  : "정상 결제 완료",
        } satisfies CustomerBillingRow,
      ];
    })
    .sort((left, right) => right.attemptedAtValue.localeCompare(left.attemptedAtValue));

  const paidAmount = rows
    .filter((row) => row.status === "paid")
    .reduce((sum, row) => sum + row.amountValue, 0);
  const refundAmount = rows
    .filter((row) => row.status === "refunded")
    .reduce((sum, row) => sum + row.amountValue, 0);
  const failedCount = rows.filter((row) => row.status === "failed").length;
  const latestRow = rows[0] ?? null;

  const issuePanel =
    failedCount > 0
      ? {
          title: "최근 결제 실패가 있습니다",
          description: "결제 수단을 점검하거나 다른 청구 시도를 준비해 주세요. 자세한 이력은 아래 표에서 확인할 수 있습니다.",
          tone: "danger" as const,
        }
      : refundAmount > 0
        ? {
            title: "환불 처리 이력이 있습니다",
            description: "최근 청구 중 환불 처리된 항목이 있어 실제 청구 금액과 환불 금액을 함께 확인하는 것이 좋습니다.",
            tone: "warning" as const,
          }
        : null;

  return {
    customer,
    headlineCards: [
      {
        label: "누적 정상 결제",
        value: formatCurrency(paidAmount),
        description: "환불 처리 건을 제외한 완료 결제 합계입니다.",
      },
      {
        label: "환불 합계",
        value: formatCurrency(refundAmount),
        description: "고객 계정에서 이미 반환된 금액입니다.",
      },
      {
        label: "결제 실패 건수",
        value: `${failedCount}건`,
        description: failedCount > 0 ? "결제 수단 점검이 필요합니다." : "최근 실패 없이 결제가 완료되었습니다.",
      },
      {
        label: "최근 결제 수단",
        value: latestRow?.methodLabel ?? "기록 없음",
        description: latestRow ? `${latestRow.attemptedAtLabel} 기준` : "아직 결제 시도가 없습니다.",
      },
    ],
    rows,
    issuePanel,
  } satisfies CustomerBillingSnapshot;
}

export function filterAndSortBillingRows(
  rows: CustomerBillingRow[],
  filters: BillingHistoryFilters,
) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  const filteredRows = rows.filter((row) => {
    if (filters.status !== "all" && row.status !== filters.status) {
      return false;
    }

    if (normalizedQuery.length === 0) {
      return true;
    }

    return [row.invoiceNumber, row.methodLabel, row.summary]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  return [...filteredRows].sort((left, right) => {
    if (filters.sortBy === "amount") {
      return right.amountValue - left.amountValue;
    }

    return right.attemptedAtValue.localeCompare(left.attemptedAtValue);
  });
}
