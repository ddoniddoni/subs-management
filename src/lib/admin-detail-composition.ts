import { adminRoleLabel } from "@/lib/domain-meta";
import type {
  AdminUser,
  AuditEvent,
  Coupon,
  Payment,
  Plan,
  Refund,
  Subscription,
} from "@/types/domain";

export type AdminDetailActivityItem = {
  actorLabel: string;
  id: string;
  occurredAt: string;
  summary: string;
};

export type SubscriptionWithPlan = Subscription & {
  plan: Plan | null;
};

export function attachPlanToSubscription(
  subscription: Subscription | null | undefined,
  plans: Plan[],
): SubscriptionWithPlan | null {
  if (!subscription) {
    return null;
  }

  return {
    ...subscription,
    plan: plans.find((plan) => plan.id === subscription.planId) ?? null,
  };
}

export function findSubscriptionWithPlanByCustomerId({
  customerId,
  plans,
  subscriptions,
}: {
  customerId: string;
  plans: Plan[];
  subscriptions: Subscription[];
}) {
  const subscription =
    subscriptions.find((item) => item.customerId === customerId) ?? null;

  return attachPlanToSubscription(subscription, plans);
}

export function findSubscriptionWithPlanBySubscriptionId({
  plans,
  subscriptionId,
  subscriptions,
}: {
  plans: Plan[];
  subscriptionId: string | null | undefined;
  subscriptions: Subscription[];
}) {
  const subscription = subscriptionId
    ? subscriptions.find((item) => item.id === subscriptionId) ?? null
    : null;

  return attachPlanToSubscription(subscription, plans);
}

export function sortPaymentsByAttemptedAt(payments: Payment[]) {
  return payments.toSorted((left, right) =>
    right.attemptedAt.localeCompare(left.attemptedAt),
  );
}

export function sortRefundsByRequestedAt(refunds: Refund[]) {
  return refunds.toSorted((left, right) =>
    right.requestedAt.localeCompare(left.requestedAt),
  );
}

export function sortCouponsByExpiresAt(coupons: Coupon[]) {
  return coupons.toSorted((left, right) =>
    right.expiresAt.localeCompare(left.expiresAt),
  );
}

export function buildAdminDetailActivityItems({
  adminUsers,
  auditEvents,
  entityType,
  targetIds,
}: {
  adminUsers: AdminUser[];
  auditEvents: AuditEvent[];
  entityType?: AuditEvent["entityType"];
  targetIds: Set<string>;
}) {
  return auditEvents
    .filter((event) => {
      if (entityType && event.entityType !== entityType) {
        return false;
      }

      return targetIds.has(event.targetId);
    })
    .toSorted((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((event) => {
      const actor = adminUsers.find((item) => item.id === event.actorAdminUserId);

      return {
        id: event.id,
        occurredAt: event.createdAt,
        summary: event.summary,
        actorLabel: actor
          ? `${actor.name} · ${adminRoleLabel[actor.role]}`
          : "관리자 정보 미확인",
      } satisfies AdminDetailActivityItem;
    });
}
