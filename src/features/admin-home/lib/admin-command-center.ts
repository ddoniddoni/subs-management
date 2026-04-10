import { formatCurrency, formatDate } from "@/lib/format";
import { mapAuditEventsToActivityItems } from "@/lib/workflow-activity";
import type {
  AuditEvent,
  Coupon,
  MetricSnapshot,
  Payment,
  Refund,
  Subscription,
} from "@/types/domain";

type CommandCenterCard = {
  label: string;
  value: string;
  description: string;
};

type PriorityQueueItem = {
  id: string;
  label: string;
  description: string;
  metric: string;
  tone: "danger" | "warning" | "info";
  href: string;
};

type QuickAccessItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  metric: string;
};

type WatchlistItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  tone: "danger" | "warning" | "info";
};

export type AdminCommandCenterSnapshot = {
  capturedAt: string;
  headlineCards: CommandCenterCard[];
  priorityQueue: PriorityQueueItem[];
  quickAccess: QuickAccessItem[];
  watchlist: WatchlistItem[];
  recentActivity: ReturnType<typeof mapAuditEventsToActivityItems>;
};

export function getAdminCommandCenterSnapshot({
  auditEvents,
  coupons,
  metricSnapshot,
  payments,
  refunds,
  subscriptions,
}: {
  auditEvents: AuditEvent[];
  coupons: Coupon[];
  metricSnapshot: MetricSnapshot | null;
  payments: Payment[];
  refunds: Refund[];
  subscriptions: Subscription[];
}): AdminCommandCenterSnapshot | null {
  if (!metricSnapshot) {
    return null;
  }

  const failedPayments = payments.filter((payment) => payment.status === "failed");
  const pendingRefunds = refunds.filter((refund) => refund.status === "requested");
  const scheduledCancels = subscriptions.filter(
    (subscription) => subscription.status === "scheduled_for_cancel",
  );
  const expiringCoupons = coupons.filter((coupon) => {
    const now = new Date(metricSnapshot.capturedAt).getTime();
    const expiresAt = new Date(coupon.expiresAt).getTime();
    const diff = expiresAt - now;

    return diff >= 0 && diff <= 1000 * 60 * 60 * 24 * 30;
  });

  const priorityQueue: PriorityQueueItem[] = [
    {
      id: "failed-payments",
      label: "실패 결제 대응",
      description:
        "다음 청구 전에 카드 실패 원인을 확인하고 재시도 우선순위를 정해야 합니다.",
      metric: `${failedPayments.length}건`,
      tone: "danger",
      href: "/admin/payments",
    },
    {
      id: "pending-refunds",
      label: "환불 검토 대기",
      description:
        "승인 또는 반려가 지연되면 고객 신뢰에 직접 영향을 주는 요청입니다.",
      metric: `${pendingRefunds.length}건`,
      tone: "warning",
      href: "/admin/refunds",
    },
    {
      id: "scheduled-cancels",
      label: "취소 예정 구독",
      description:
        "이탈 징후 고객을 확인하고 보상 쿠폰이나 후속 메모가 필요한지 점검합니다.",
      metric: `${scheduledCancels.length}건`,
      tone: "warning",
      href: "/admin/subscriptions",
    },
    {
      id: "expiring-coupons",
      label: "만료 임박 쿠폰",
      description:
        "갱신 보상이나 회수 시점 확인이 필요한 프로모션입니다.",
      metric: `${expiringCoupons.length}건`,
      tone: "info",
      href: "/admin/coupons",
    },
  ];

  const quickAccess: QuickAccessItem[] = [
    {
      id: "payments",
      title: "결제 작업대",
      description: "실패 결제와 최근 결제 상세를 바로 확인합니다.",
      href: "/admin/payments",
      metric: `${failedPayments.length}건 실패`,
    },
    {
      id: "refunds",
      title: "환불 검토 보드",
      description: "승인 대기 환불과 최근 처리 건을 함께 봅니다.",
      href: "/admin/refunds",
      metric: `${pendingRefunds.length}건 대기`,
    },
    {
      id: "subscriptions",
      title: "구독 운영 워크벤치",
      description:
        "past due, 일시 중지, 취소 예정 구독의 상태 전환을 한 화면에서 처리합니다.",
      href: "/admin/subscriptions",
      metric: `${subscriptions.length}건 구독`,
    },
    {
      id: "audit-log",
      title: "감사 로그",
      description: "가장 최근 운영 액션과 민감한 변경 이력을 추적합니다.",
      href: "/admin/audit-log",
      metric: `${auditEvents.length}건 이벤트`,
    },
  ];

  const watchlist: WatchlistItem[] = [
    ...failedPayments.slice(0, 2).map((payment) => ({
      id: payment.id,
      title: `${payment.id} 결제 실패`,
      description: `${formatCurrency(payment.amount)} · ${formatDate(
        payment.attemptedAt,
      )} · ${payment.methodLabel}`,
      href: `/admin/payments/${payment.id}`,
      tone: "danger" as const,
    })),
    ...pendingRefunds.slice(0, 2).map((refund) => ({
      id: refund.id,
      title: `${refund.id} 환불 검토 필요`,
      description: `${formatCurrency(refund.amount)} · ${refund.reason}`,
      href: `/admin/refunds/${refund.id}`,
      tone: "warning" as const,
    })),
    ...scheduledCancels.slice(0, 1).map((subscription) => ({
      id: subscription.id,
      title: `${subscription.id} 취소 예정`,
      description: `${subscription.seats}석 · ${
        subscription.cancelAt ? formatDate(subscription.cancelAt) : "취소 일정 미정"
      }까지 유지`,
      href: `/admin/customers/${subscription.customerId}`,
      tone: "info" as const,
    })),
  ];

  return {
    capturedAt: metricSnapshot.capturedAt,
    headlineCards: [
      {
        label: "활성 고객",
        value: metricSnapshot.activeCustomers.toLocaleString("ko-KR"),
        description: `${formatDate(metricSnapshot.capturedAt)} 기준 활성 구독 고객 수입니다.`,
      },
      {
        label: "월간 반복 매출",
        value: formatCurrency(metricSnapshot.monthlyRecurringRevenue),
        description: "오늘 운영 현황을 빠르게 파악하는 기준 MRR입니다.",
      },
      {
        label: "오늘 우선 처리",
        value: `${failedPayments.length + pendingRefunds.length}건`,
        description: "실패 결제와 환불 대기 중 즉시 대응이 필요한 건수입니다.",
      },
      {
        label: "이탈 경고",
        value: `${metricSnapshot.churnRate}%`,
        description: `${scheduledCancels.length}건의 취소 예정 구독이 반영된 최근 이탈 지표입니다.`,
      },
    ],
    priorityQueue,
    quickAccess,
    watchlist,
    recentActivity: mapAuditEventsToActivityItems(auditEvents).slice(0, 5),
  };
}
