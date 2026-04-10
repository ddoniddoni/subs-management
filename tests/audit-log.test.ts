import { describe, expect, it } from "vitest";

import {
  buildAuditLogRecords,
  filterAuditLogRecords,
  summarizeAuditLog,
} from "@/features/audit-log/lib/audit-log";
import {
  adminUsers,
  auditEvents,
  coupons,
  customers,
  payments,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

describe("audit log helpers", () => {
  it("builds audit records with linked targets", () => {
    const records = buildAuditLogRecords({
      adminUsers,
      auditEvents,
      coupons,
      customers,
      payments,
      refunds,
      subscriptions,
    });

    expect(records[0]?.summary).toBe("고객 유지 대응 메모를 업데이트했습니다.");
    expect(records[0]?.href).toBe("/admin/customers/cust_001");
    expect(records.find((record) => record.targetId === "pay_004")?.href).toBe(
      "/admin/payments/pay_004",
    );
    expect(records.find((record) => record.targetId === "refund_001")?.href).toBe(
      "/admin/refunds/refund_001",
    );
    expect(records.find((record) => record.targetId === "coupon_002")?.href).toBe(
      "/admin/customers/cust_002",
    );
  });

  it("filters records by actor and entity type", () => {
    const records = buildAuditLogRecords({
      adminUsers,
      auditEvents,
      coupons,
      customers,
      payments,
      refunds,
      subscriptions,
    });

    const filtered = filterAuditLogRecords(records, {
      actorAdminUserId: "admin_001",
      entityType: "coupon",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.targetId).toBe("coupon_002");
  });

  it("summarizes filtered audit records", () => {
    const records = buildAuditLogRecords({
      adminUsers,
      auditEvents,
      coupons,
      customers,
      payments,
      refunds,
      subscriptions,
    });

    const summary = summarizeAuditLog(records);

    expect(summary.total).toBe("5건");
    expect(summary.uniqueActors).toBe("3명");
  });
});
