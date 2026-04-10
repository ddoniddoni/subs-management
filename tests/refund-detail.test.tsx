import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RefundDetailView } from "@/features/refunds/components/refund-detail-view";
import { getRefundDetailSnapshot } from "@/features/refunds/lib/refund-detail";
import {
  adminUsers,
  auditEvents,
  customers,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

describe("getRefundDetailSnapshot", () => {
  it("builds a refund detail snapshot with related entities", () => {
    const snapshot = getRefundDetailSnapshot({
      adminUsers,
      auditEvents,
      customers,
      payments,
      plans,
      refundId: "refund_001",
      refunds,
      subscriptions,
    });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.customer?.name).toBe("김민서");
    expect(snapshot?.payment?.id).toBe("pay_002");
    expect(snapshot?.activityItems).toHaveLength(1);
    expect(snapshot?.stats.refundAmount).toBe("₩29,000");
  });

  it("returns null for an unknown refund id", () => {
    const snapshot = getRefundDetailSnapshot({
      adminUsers,
      auditEvents,
      customers,
      payments,
      plans,
      refundId: "refund_missing",
      refunds,
      subscriptions,
    });

    expect(snapshot).toBeNull();
  });
});

describe("RefundDetailView", () => {
  it("renders refund context and related links", () => {
    const snapshot = getRefundDetailSnapshot({
      adminUsers,
      auditEvents,
      customers,
      payments,
      plans,
      refundId: "refund_001",
      refunds,
      subscriptions,
    });

    expect(snapshot).not.toBeNull();

    render(<RefundDetailView snapshot={snapshot!} />);

    expect(screen.getByText("refund_001 환불 검토 상세")).toBeInTheDocument();
    expect(screen.getByText("중복 결제 보정")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "고객 상세 보기" }),
    ).toHaveAttribute("href", "/admin/customers/cust_001");
    expect(screen.getByText("중복 결제 건 환불을 승인했습니다.")).toBeInTheDocument();
  });
});
