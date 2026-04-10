import { adminRoleLabel } from "@/lib/domain-meta";
import type {
  AdminUser,
  AuditEvent,
  Coupon,
  Customer,
  Payment,
  Refund,
  Subscription,
} from "@/types/domain";

type AuditLogFilter = {
  actorAdminUserId?: string;
  entityType?: AuditEvent["entityType"];
};

type AuditLogRecord = {
  action: string;
  actorAdminUserId: string;
  actorLabel: string;
  actorRoleLabel: string;
  createdAt: string;
  entityLabel: string;
  entityType: AuditEvent["entityType"];
  href: string | null;
  id: string;
  summary: string;
  targetId: string;
};

type BuildAuditLogRecordsInput = {
  adminUsers: AdminUser[];
  auditEvents: AuditEvent[];
  coupons: Coupon[];
  customers: Customer[];
  payments: Payment[];
  refunds: Refund[];
  subscriptions: Subscription[];
};

const entityTypeMeta: Record<AuditEvent["entityType"], { label: string; tone: "info" | "warning" | "success" | "danger" | "neutral" }> = {
  subscription: { label: "구독", tone: "info" },
  payment: { label: "결제", tone: "danger" },
  refund: { label: "환불", tone: "warning" },
  coupon: { label: "쿠폰", tone: "success" },
  customer: { label: "고객", tone: "neutral" },
};

export function buildAuditLogRecords({
  adminUsers,
  auditEvents,
  coupons,
  customers,
  payments,
  refunds,
  subscriptions,
}: BuildAuditLogRecordsInput): AuditLogRecord[] {
  return auditEvents
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((event) => {
      const actor = adminUsers.find((item) => item.id === event.actorAdminUserId);

      return {
        id: event.id,
        action: event.action,
        createdAt: event.createdAt,
        entityType: event.entityType,
        entityLabel: entityTypeMeta[event.entityType].label,
        targetId: event.targetId,
        summary: event.summary,
        href: getAuditTargetHref({
          coupons,
          customers,
          entityType: event.entityType,
          payments,
          refunds,
          subscriptions,
          targetId: event.targetId,
        }),
        actorAdminUserId: event.actorAdminUserId,
        actorLabel: actor?.name ?? "관리자 정보 미확인",
        actorRoleLabel: actor ? adminRoleLabel[actor.role] : "권한 미확인",
      };
    });
}

export function filterAuditLogRecords(
  records: AuditLogRecord[],
  filter: AuditLogFilter,
) {
  return records.filter((record) => {
    if (filter.entityType && record.entityType !== filter.entityType) {
      return false;
    }

    if (filter.actorAdminUserId) {
      return record.actorAdminUserId === filter.actorAdminUserId;
    }

    return true;
  });
}

function getAuditTargetHref({
  coupons,
  customers,
  entityType,
  payments,
  refunds,
  subscriptions,
  targetId,
}: {
  coupons: Coupon[];
  customers: Customer[];
  entityType: AuditEvent["entityType"];
  payments: Payment[];
  refunds: Refund[];
  subscriptions: Subscription[];
  targetId: string;
}) {
  if (entityType === "customer") {
    return customers.find((item) => item.id === targetId)
      ? `/admin/customers/${targetId}`
      : null;
  }

  if (entityType === "subscription") {
    const subscription = subscriptions.find((item) => item.id === targetId);
    return subscription ? `/admin/customers/${subscription.customerId}` : "/admin/customers";
  }

  if (entityType === "payment") {
    const payment = payments.find((item) => item.id === targetId);
    return payment ? `/admin/customers/${payment.customerId}` : "/admin/payments";
  }

  if (entityType === "refund") {
    const refund = refunds.find((item) => item.id === targetId);
    return refund ? `/admin/customers/${refund.customerId}` : "/admin/refunds";
  }

  if (entityType === "coupon") {
    const coupon = coupons.find((item) => item.id === targetId);
    return coupon?.assignedCustomerId
      ? `/admin/customers/${coupon.assignedCustomerId}`
      : "/admin/coupons";
  }

  return null;
}

export function summarizeAuditLog(records: AuditLogRecord[]) {
  return {
    total: `${records.length}건`,
    highRisk: `${records.filter((record) => record.entityType === "payment" || record.entityType === "refund").length}건`,
    uniqueActors: `${new Set(records.map((record) => record.actorLabel)).size}명`,
    customerLinked: `${records.filter((record) => record.href?.startsWith("/admin/customers/")).length}건`,
  };
}

export function getEntityTypeMeta(entityType: AuditEvent["entityType"]) {
  return entityTypeMeta[entityType];
}

export type { AuditLogFilter, AuditLogRecord };
