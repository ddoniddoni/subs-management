export type NavigationItem = {
  href: string;
  label: string;
};

export const customerNavigationItems: NavigationItem[] = [
  { href: "/", label: "소개" },
  { href: "/pricing", label: "요금제" },
  { href: "/checkout", label: "체크아웃" },
  { href: "/app/subscription", label: "내 구독" },
  { href: "/app/billing", label: "결제 내역" },
];

export const adminNavigationItems: NavigationItem[] = [
  { href: "/admin", label: "개요" },
  { href: "/admin/customers", label: "고객" },
  { href: "/admin/subscriptions", label: "구독" },
  { href: "/admin/payments", label: "결제" },
  { href: "/admin/refunds", label: "환불" },
  { href: "/admin/coupons", label: "쿠폰" },
  { href: "/admin/analytics", label: "분석" },
  { href: "/admin/admin-users", label: "관리자" },
  { href: "/admin/audit-log", label: "감사 로그" },
];
