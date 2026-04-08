export type BillingInterval = "monthly" | "annual";

export type PlanCode = "starter" | "pro" | "team";

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "paused"
  | "scheduled_for_cancel"
  | "canceled";

export type PaymentStatus =
  | "paid"
  | "pending"
  | "failed"
  | "refunded";

export type RefundStatus = "requested" | "approved" | "rejected";

export type CouponStatus = "active" | "scheduled" | "revoked" | "expired";

export type AdminRole =
  | "viewer"
  | "support"
  | "billing_manager"
  | "ops_admin";

export type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  segment: "개인" | "성장" | "엔터프라이즈";
  joinedAt: string;
};

export type Plan = {
  id: string;
  code: PlanCode;
  name: string;
  price: number;
  currency: "KRW";
  billingInterval: BillingInterval;
  seatsIncluded: number;
  description: string;
};

export type Subscription = {
  id: string;
  customerId: string;
  planId: string;
  status: SubscriptionStatus;
  seats: number;
  startedAt: string;
  nextBillingDate: string | null;
  cancelAt: string | null;
};

export type Invoice = {
  id: string;
  subscriptionId: string;
  number: string;
  amount: number;
  currency: "KRW";
  issuedAt: string;
  dueAt: string;
  paymentStatus: PaymentStatus;
};

export type Payment = {
  id: string;
  invoiceId: string;
  customerId: string;
  subscriptionId: string;
  amount: number;
  currency: "KRW";
  status: PaymentStatus;
  methodLabel: string;
  attemptedAt: string;
};

export type Refund = {
  id: string;
  paymentId: string;
  customerId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
  reviewedAt: string | null;
};

export type Coupon = {
  id: string;
  code: string;
  title: string;
  status: CouponStatus;
  discountType: "percent" | "fixed";
  discountValue: number;
  assignedCustomerId: string | null;
  expiresAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

export type AuditEvent = {
  id: string;
  actorAdminUserId: string;
  entityType: "subscription" | "payment" | "refund" | "coupon" | "customer";
  action: string;
  targetId: string;
  summary: string;
  createdAt: string;
};

export type MetricSnapshot = {
  capturedAt: string;
  activeCustomers: number;
  monthlyRecurringRevenue: number;
  failedPayments: number;
  refundsPending: number;
  churnRate: number;
};
