import { formatCurrency } from "@/lib/format";
import type {
  Coupon,
  Customer,
  MetricSnapshot,
  Payment,
  Plan,
  Refund,
  Subscription,
} from "@/types/domain";

type AnalyticsDashboardSnapshot = {
  capturedAt: string;
  headlineCards: {
    delta: string;
    description: string;
    label: string;
    value: string;
  }[];
  planMix: {
    label: string;
    value: string;
  }[];
  revenueTrend: {
    activeCustomers: number;
    failedPayments: number;
    heightPercent: number;
    label: string;
    revenueLabel: string;
  }[];
  riskQueue: {
    href: string;
    id: string;
    label: string;
    metric: string;
    tone: "danger" | "info" | "warning";
  }[];
  segmentMix: {
    label: string;
    value: string;
  }[];
  statusMix: {
    label: string;
    value: string;
  }[];
};

export function getAnalyticsDashboardSnapshot({
  coupons,
  customers,
  metricSnapshots,
  payments,
  plans,
  refunds,
  subscriptions,
}: {
  coupons: Coupon[];
  customers: Customer[];
  metricSnapshots: MetricSnapshot[];
  payments: Payment[];
  plans: Plan[];
  refunds: Refund[];
  subscriptions: Subscription[];
}): AnalyticsDashboardSnapshot | null {
  if (metricSnapshots.length === 0) {
    return null;
  }

  const sortedSnapshots = metricSnapshots.toSorted((a, b) =>
    a.capturedAt.localeCompare(b.capturedAt),
  );
  const currentSnapshot = sortedSnapshots.at(-1);
  const previousSnapshot = sortedSnapshots.at(-2) ?? currentSnapshot;

  if (!currentSnapshot || !previousSnapshot) {
    return null;
  }

  const maxRevenue = Math.max(
    ...sortedSnapshots.map((snapshot) => snapshot.monthlyRecurringRevenue),
  );
  const failedPayments = payments.filter((payment) => payment.status === "failed");
  const pendingRefunds = refunds.filter((refund) => refund.status === "requested");
  const expiringCoupons = coupons.filter((coupon) => {
    const diff =
      new Date(coupon.expiresAt).getTime() - new Date(currentSnapshot.capturedAt).getTime();

    return diff >= 0 && diff <= 1000 * 60 * 60 * 24 * 30;
  });

  const revenueTrend = sortedSnapshots.map((snapshot) => ({
    label: new Intl.DateTimeFormat("ko-KR", { month: "short" }).format(
      new Date(snapshot.capturedAt),
    ),
    revenueLabel: formatCurrency(snapshot.monthlyRecurringRevenue),
    activeCustomers: snapshot.activeCustomers,
    failedPayments: snapshot.failedPayments,
    heightPercent: Math.max(
      18,
      Math.round((snapshot.monthlyRecurringRevenue / maxRevenue) * 100),
    ),
  }));

  const headlineCards = [
    {
      label: "월간 반복 매출",
      value: formatCurrency(currentSnapshot.monthlyRecurringRevenue),
      delta: formatSignedDelta(
        currentSnapshot.monthlyRecurringRevenue - previousSnapshot.monthlyRecurringRevenue,
        "currency",
      ),
      description: "직전 시점 대비 MRR 변화입니다.",
    },
    {
      label: "활성 고객",
      value: currentSnapshot.activeCustomers.toLocaleString("ko-KR"),
      delta: formatSignedDelta(
        currentSnapshot.activeCustomers - previousSnapshot.activeCustomers,
        "count",
      ),
      description: "활성 상태를 유지하는 고객 수입니다.",
    },
    {
      label: "실패 결제",
      value: `${currentSnapshot.failedPayments}건`,
      delta: formatSignedDelta(
        currentSnapshot.failedPayments - previousSnapshot.failedPayments,
        "count",
      ),
      description: "추가 대응이 필요한 실패 결제 건수입니다.",
    },
    {
      label: "예상 이탈률",
      value: `${currentSnapshot.churnRate}%`,
      delta: formatSignedDelta(
        Number((currentSnapshot.churnRate - previousSnapshot.churnRate).toFixed(1)),
        "percent",
      ),
      description: "직전 시점 대비 churn 변화입니다.",
    },
  ];

  const statusMix = Object.entries(
    subscriptions.reduce<Record<string, number>>((accumulator, subscription) => {
      accumulator[subscription.status] = (accumulator[subscription.status] ?? 0) + 1;
      return accumulator;
    }, {}),
  ).map(([status, count]) => ({
    label: status.replaceAll("_", " "),
    value: `${count}건`,
  }));

  const planMix = Object.entries(
    subscriptions.reduce<Record<string, number>>((accumulator, subscription) => {
      const plan = plans.find((item) => item.id === subscription.planId);
      const label = plan?.name ?? "미확인 플랜";

      accumulator[label] = (accumulator[label] ?? 0) + 1;
      return accumulator;
    }, {}),
  ).map(([label, count]) => ({
    label,
    value: `${count}건`,
  }));

  const segmentMix = Object.entries(
    customers.reduce<Record<string, number>>((accumulator, customer) => {
      accumulator[customer.segment] = (accumulator[customer.segment] ?? 0) + 1;
      return accumulator;
    }, {}),
  ).map(([label, count]) => ({
    label,
    value: `${count}개`,
  }));

  const riskQueue = [
    {
      id: "failed-payments",
      label: "실패 결제 대응",
      metric: `${failedPayments.length}건`,
      tone: "danger" as const,
      href: "/admin/payments",
    },
    {
      id: "pending-refunds",
      label: "환불 대기 검토",
      metric: `${pendingRefunds.length}건`,
      tone: "warning" as const,
      href: "/admin/refunds",
    },
    {
      id: "expiring-coupons",
      label: "만료 임박 쿠폰",
      metric: `${expiringCoupons.length}건`,
      tone: "info" as const,
      href: "/admin/coupons",
    },
  ];

  return {
    capturedAt: currentSnapshot.capturedAt,
    headlineCards,
    revenueTrend,
    statusMix,
    planMix,
    segmentMix,
    riskQueue,
  };
}

function formatSignedDelta(
  value: number,
  mode: "count" | "currency" | "percent",
) {
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);

  if (mode === "currency") {
    return `${prefix}${formatCurrency(absoluteValue)}`;
  }

  if (mode === "percent") {
    return `${prefix}${absoluteValue}%p`;
  }

  return `${prefix}${absoluteValue}건`;
}

export type { AnalyticsDashboardSnapshot };
