import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PaymentDetailView } from "@/features/payments/components/payment-detail-view";
import { getPaymentDetailSnapshot } from "@/features/payments/lib/payment-detail";
import {
  adminUsers,
  auditEvents,
  customers,
  invoices,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

describe("getPaymentDetailSnapshot", () => {
  it("builds a payment detail snapshot with related billing context", () => {
    const snapshot = getPaymentDetailSnapshot({
      adminUsers,
      auditEvents,
      customers,
      invoices,
      paymentId: "pay_002",
      payments,
      plans,
      refunds,
      subscriptions,
    });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.customer?.id).toBe("cust_001");
    expect(snapshot?.invoice?.number).toBe("INV-240301");
    expect(snapshot?.refunds).toHaveLength(1);
    expect(snapshot?.activityItems).toHaveLength(1);
    expect(snapshot?.stats.amount).toBe("₩29,000");
  });

  it("returns null for an unknown payment id", () => {
    const snapshot = getPaymentDetailSnapshot({
      adminUsers,
      auditEvents,
      customers,
      invoices,
      paymentId: "pay_missing",
      payments,
      plans,
      refunds,
      subscriptions,
    });

    expect(snapshot).toBeNull();
  });
});

describe("PaymentDetailView", () => {
  it("renders related customer, refund, and activity links", () => {
    const snapshot = getPaymentDetailSnapshot({
      adminUsers,
      auditEvents,
      customers,
      invoices,
      paymentId: "pay_002",
      payments,
      plans,
      refunds,
      subscriptions,
    });

    expect(snapshot).not.toBeNull();

    render(<PaymentDetailView snapshot={snapshot!} />);

    expect(screen.getByText("pay_002 결제 추적")).toBeInTheDocument();
    expect(screen.getAllByText("연결 환불").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "고객 상세 보기" }),
    ).toHaveAttribute("href", "/admin/customers/cust_001");
    expect(
      screen.getByRole("link", { name: "연결 환불 보기" }),
    ).toHaveAttribute("href", "/admin/refunds/refund_001");
    expect(screen.getByText("중복 결제 건 환불을 승인했습니다.")).toBeInTheDocument();
  });
});
