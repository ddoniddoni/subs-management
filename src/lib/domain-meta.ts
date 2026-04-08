export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

export const subscriptionStatusMeta = {
  active: { label: "활성", tone: "success" },
  past_due: { label: "결제 지연", tone: "warning" },
  paused: { label: "일시 중지", tone: "neutral" },
  scheduled_for_cancel: { label: "해지 예정", tone: "danger" },
  canceled: { label: "해지", tone: "danger" },
} as const satisfies Record<string, { label: string; tone: BadgeTone }>;

export const paymentStatusMeta = {
  paid: { label: "결제 완료", tone: "success" },
  pending: { label: "처리 중", tone: "info" },
  failed: { label: "결제 실패", tone: "danger" },
  refunded: { label: "환불 처리", tone: "warning" },
} as const satisfies Record<string, { label: string; tone: BadgeTone }>;

export const refundStatusMeta = {
  requested: { label: "검토 대기", tone: "warning" },
  approved: { label: "승인 완료", tone: "success" },
  rejected: { label: "반려", tone: "danger" },
} as const satisfies Record<string, { label: string; tone: BadgeTone }>;

export const couponStatusMeta = {
  active: { label: "활성", tone: "success" },
  scheduled: { label: "예약", tone: "info" },
  revoked: { label: "회수", tone: "danger" },
  expired: { label: "만료", tone: "neutral" },
} as const satisfies Record<string, { label: string; tone: BadgeTone }>;

export const adminRoleLabel = {
  viewer: "뷰어",
  support: "고객 지원",
  billing_manager: "결제 관리자",
  ops_admin: "운영 관리자",
} as const satisfies Record<string, string>;
