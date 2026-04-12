import {
  paymentStatusMeta,
  subscriptionStatusMeta,
  type BadgeTone,
} from "@/lib/domain-meta";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import type {
  Coupon,
  Customer,
  Payment,
  Plan,
  Refund,
  Subscription,
  SubscriptionStatus,
} from "@/types/domain";

import {
  buildCustomerTableRows,
  type CustomerTableRow,
} from "./customer-table";

export type SubscriptionTransitionOption = {
  confirmLabel: string;
  description: string;
  guardLabel: string;
  guardTone: BadgeTone;
  label: string;
  nextStatus: SubscriptionStatus;
  reasonHint: string;
};

export type SubscriptionRiskItem = {
  description: string;
  id: string;
  label: string;
  tone: BadgeTone;
};

export type SubscriptionContextSnapshot = {
  activeCoupons: Coupon[];
  latestPayment: Payment | null;
  pendingRefunds: Refund[];
  recentPayments: Payment[];
  recentRefunds: Refund[];
  riskItems: SubscriptionRiskItem[];
  row: CustomerTableRow;
};

const transitionOptions: Record<SubscriptionStatus, SubscriptionTransitionOption[]> = {
  active: [
    {
      nextStatus: "paused",
      label: "일시 중지",
      description: "다음 청구 전에 서비스 사용을 멈추고 후속 대응 여부를 점검합니다.",
      guardLabel: "서비스 중단 영향",
      guardTone: "warning",
      confirmLabel: "일시 중지 적용",
      reasonHint: "고객 요청 또는 내부 운영 사유를 남겨 주세요.",
    },
    {
      nextStatus: "scheduled_for_cancel",
      label: "해지 예약",
      description: "현재 청구 주기가 끝나면 자동으로 해지되도록 예약합니다.",
      guardLabel: "이탈 예방 필요",
      guardTone: "danger",
      confirmLabel: "해지 예약 등록",
      reasonHint: "해지 요청 배경과 리텐션 시도 여부를 기록해 주세요.",
    },
  ],
  past_due: [
    {
      nextStatus: "active",
      label: "정상 복구",
      description: "수동 확인 후 구독을 다시 정상 상태로 전환합니다.",
      guardLabel: "결제 확인 필요",
      guardTone: "warning",
      confirmLabel: "정상 상태로 복구",
      reasonHint: "결제 확인 결과나 고객 안내 내용을 남겨 주세요.",
    },
    {
      nextStatus: "paused",
      label: "일시 중지",
      description: "결제 이슈가 해결될 때까지 구독 사용을 일시 중지합니다.",
      guardLabel: "지원 후속 조치",
      guardTone: "warning",
      confirmLabel: "일시 중지 적용",
      reasonHint: "중지 이유와 고객 커뮤니케이션 계획을 적어 주세요.",
    },
    {
      nextStatus: "scheduled_for_cancel",
      label: "해지 예약",
      description: "지속적인 결제 실패로 다음 청구 시점 종료를 예약합니다.",
      guardLabel: "이탈 확정 위험",
      guardTone: "danger",
      confirmLabel: "해지 예약 등록",
      reasonHint: "해지 예약 근거와 보상 시도 여부를 남겨 주세요.",
    },
  ],
  paused: [
    {
      nextStatus: "active",
      label: "재개",
      description: "고객 요청 또는 운영 판단에 따라 구독을 다시 활성화합니다.",
      guardLabel: "재활성화 확인",
      guardTone: "info",
      confirmLabel: "구독 재개",
      reasonHint: "재개 사유와 다음 청구 대응 계획을 적어 주세요.",
    },
    {
      nextStatus: "scheduled_for_cancel",
      label: "해지 예약",
      description: "중지 상태에서 종료를 확정하기 전 예약 상태로 전환합니다.",
      guardLabel: "이탈 후속 검토",
      guardTone: "danger",
      confirmLabel: "해지 예약 등록",
      reasonHint: "중지에서 해지로 넘어가는 이유를 남겨 주세요.",
    },
  ],
  scheduled_for_cancel: [
    {
      nextStatus: "active",
      label: "예약 취소",
      description: "유지 설득 또는 고객 요청 변경으로 해지 예약을 되돌립니다.",
      guardLabel: "리텐션 성공",
      guardTone: "success",
      confirmLabel: "예약 취소 후 유지",
      reasonHint: "유지된 배경과 후속 케어 계획을 기록해 주세요.",
    },
    {
      nextStatus: "canceled",
      label: "즉시 해지",
      description: "다음 청구일까지 기다리지 않고 즉시 종료 처리합니다.",
      guardLabel: "즉시 종료 영향",
      guardTone: "danger",
      confirmLabel: "즉시 해지 실행",
      reasonHint: "즉시 해지 근거와 고객 안내 내용을 남겨 주세요.",
    },
  ],
  canceled: [
    {
      nextStatus: "active",
      label: "재활성화",
      description: "복귀 고객을 위해 기존 구독을 다시 활성 상태로 전환합니다.",
      guardLabel: "복귀 고객 처리",
      guardTone: "info",
      confirmLabel: "재활성화 적용",
      reasonHint: "복귀 배경과 재청구 일정을 기록해 주세요.",
    },
  ],
};

export function getSubscriptionTransitionOptions(status: SubscriptionStatus) {
  return transitionOptions[status];
}

export function validateSubscriptionTransition({
  currentStatus,
  nextStatus,
  reason,
}: {
  currentStatus: SubscriptionStatus;
  nextStatus: SubscriptionStatus;
  reason: string;
}) {
  if (currentStatus === nextStatus) {
    return "현재 상태와 동일한 상태로는 변경할 수 없습니다.";
  }

  if (reason.trim().length < 8) {
    return "상태 변경 사유를 8자 이상 입력해 주세요.";
  }

  return null;
}

export function buildSubscriptionRows({
  customers,
  payments,
  plans,
  subscriptions,
}: {
  customers: Customer[];
  payments: Payment[];
  plans: Plan[];
  subscriptions: Subscription[];
}) {
  return buildCustomerTableRows({
    customers,
    payments,
    plans,
    subscriptions,
  });
}

export function buildSubscriptionContextSnapshot({
  coupons,
  customerTableRows,
  payments,
  refunds,
  subscriptionId,
}: {
  coupons: Coupon[];
  customerTableRows: CustomerTableRow[];
  payments: Payment[];
  refunds: Refund[];
  subscriptionId: string;
}) {
  const row = customerTableRows.find(
    (candidate) => candidate.subscription.id === subscriptionId,
  );

  if (!row) {
    return null;
  }

  const recentPayments = payments
    .filter((payment) => payment.subscriptionId === subscriptionId)
    .toSorted((left, right) => right.attemptedAt.localeCompare(left.attemptedAt));
  const paymentIds = new Set(recentPayments.map((payment) => payment.id));
  const recentRefunds = refunds
    .filter((refund) => paymentIds.has(refund.paymentId))
    .toSorted((left, right) => right.requestedAt.localeCompare(left.requestedAt));
  const activeCoupons = coupons
    .filter((coupon) => coupon.assignedCustomerId === row.customer.id)
    .toSorted((left, right) => right.expiresAt.localeCompare(left.expiresAt));

  const latestPayment = recentPayments[0] ?? null;
  const pendingRefunds = recentRefunds.filter((refund) => refund.status === "requested");
  const riskItems: SubscriptionRiskItem[] = [];

  if (latestPayment?.status === "failed") {
    riskItems.push({
      id: "latest-payment-failed",
      label: "최근 결제 실패",
      tone: "danger",
      description: `${formatDateTime(latestPayment.attemptedAt)} · ${formatCurrency(
        latestPayment.amount,
      )} · ${paymentStatusMeta[latestPayment.status].label}`,
    });
  }

  if (pendingRefunds.length > 0) {
    riskItems.push({
      id: "pending-refund",
      label: "검토 중 환불",
      tone: "warning",
      description: `${pendingRefunds.length}건의 환불 요청이 남아 있습니다.`,
    });
  }

  if (activeCoupons.some((coupon) => coupon.status === "active")) {
    riskItems.push({
      id: "active-coupon",
      label: "활성 보상 쿠폰",
      tone: "info",
      description: "고객 계정에 아직 활성 상태인 보상 쿠폰이 있습니다.",
    });
  }

  if (row.subscription.cancelAt) {
    riskItems.push({
      id: "scheduled-cancel",
      label: "종료 예정일 설정",
      tone: "warning",
      description: `${formatDate(row.subscription.cancelAt)} 종료 일정이 잡혀 있습니다.`,
    });
  }

  return {
    activeCoupons,
    latestPayment,
    pendingRefunds,
    recentPayments,
    recentRefunds,
    riskItems,
    row,
  } satisfies SubscriptionContextSnapshot;
}

export function buildSubscriptionChangeSummary({
  customerName,
  nextStatus,
  previousStatus,
}: {
  customerName: string;
  nextStatus: SubscriptionStatus;
  previousStatus: SubscriptionStatus;
}) {
  return `${customerName} 고객의 구독 상태를 ${subscriptionStatusMeta[previousStatus].label}에서 ${subscriptionStatusMeta[nextStatus].label}(으)로 변경했습니다.`;
}

export function buildSubscriptionChangeDetail({
  reason,
  subscriptionId,
}: {
  reason: string;
  subscriptionId: string;
}) {
  return `subscription · ${subscriptionId} · 사유: ${reason.trim()}`;
}
