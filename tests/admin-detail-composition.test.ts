import { describe, expect, it } from "vitest";

import {
  attachPlanToSubscription,
  buildAdminDetailActivityItems,
  findSubscriptionWithPlanByCustomerId,
  findSubscriptionWithPlanBySubscriptionId,
  sortCouponsByExpiresAt,
  sortPaymentsByAttemptedAt,
  sortRefundsByRequestedAt,
} from "@/lib/admin-detail-composition";
import {
  adminUsers,
  auditEvents,
  coupons,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

describe("admin detail composition helpers", () => {
  it("attaches plan metadata to a subscription", () => {
    const enriched = attachPlanToSubscription(subscriptions[0], plans);

    expect(enriched?.id).toBe("sub_001");
    expect(enriched?.plan?.id).toBe("plan_pro");
  });

  it("finds subscriptions with plan metadata by customer or subscription id", () => {
    const byCustomer = findSubscriptionWithPlanByCustomerId({
      customerId: "cust_002",
      plans,
      subscriptions,
    });
    const bySubscription = findSubscriptionWithPlanBySubscriptionId({
      plans,
      subscriptionId: "sub_003",
      subscriptions,
    });

    expect(byCustomer?.id).toBe("sub_002");
    expect(byCustomer?.plan?.id).toBe("plan_team");
    expect(bySubscription?.id).toBe("sub_003");
    expect(bySubscription?.plan?.id).toBe("plan_starter");
  });

  it("sorts payments, refunds, and coupons in descending operational order", () => {
    expect(sortPaymentsByAttemptedAt(payments).map((item) => item.id)).toEqual([
      "pay_004",
      "pay_001",
      "pay_005",
      "pay_002",
      "pay_003",
    ]);
    expect(sortRefundsByRequestedAt(refunds).map((item) => item.id)).toEqual([
      "refund_002",
      "refund_001",
    ]);
    expect(sortCouponsByExpiresAt(coupons).map((item) => item.id)).toEqual([
      "coupon_001",
      "coupon_002",
      "coupon_003",
    ]);
  });

  it("builds admin activity items with actor labels and target filtering", () => {
    const items = buildAdminDetailActivityItems({
      adminUsers,
      auditEvents,
      targetIds: new Set(["refund_001", "pay_004"]),
    });

    expect(items.map((item) => item.id)).toEqual(["audit_003", "audit_001"]);
    expect(items[0]?.actorLabel).toContain("정하은");
    expect(items[1]?.actorLabel).toContain("최지훈");
  });

  it("can restrict activity items to a specific entity type", () => {
    const items = buildAdminDetailActivityItems({
      adminUsers,
      auditEvents,
      entityType: "refund",
      targetIds: new Set(["refund_001", "pay_004"]),
    });

    expect(items).toHaveLength(1);
    expect(items[0]?.id).toBe("audit_001");
  });
});
