import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CustomerDetailView } from "@/features/customers/components/customer-detail-view";
import { getCustomerDetailSnapshot } from "@/features/customers/lib/customer-detail";
import {
  adminUsers,
  auditEvents,
  coupons,
  customers,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

describe("getCustomerDetailSnapshot", () => {
  it("returns a composed customer detail snapshot", () => {
    const snapshot = getCustomerDetailSnapshot({
      customerId: "cust_001",
      customers,
      subscriptions,
      plans,
      payments,
      refunds,
      coupons,
      auditEvents,
      adminUsers,
    });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.customer.name).toBe("김민서");
    expect(snapshot?.payments).toHaveLength(3);
    expect(snapshot?.refunds).toHaveLength(1);
    expect(snapshot?.coupons).toHaveLength(1);
    expect(snapshot?.stats.totalPayments).toBe("₩58,000");
  });

  it("returns null for an unknown customer id", () => {
    const snapshot = getCustomerDetailSnapshot({
      customerId: "cust_missing",
      customers,
      subscriptions,
      plans,
      payments,
      refunds,
      coupons,
      auditEvents,
      adminUsers,
    });

    expect(snapshot).toBeNull();
  });
});

describe("CustomerDetailView", () => {
  it("renders the customer overview and linked history sections", () => {
    const snapshot = getCustomerDetailSnapshot({
      customerId: "cust_001",
      customers,
      subscriptions,
      plans,
      payments,
      refunds,
      coupons,
      auditEvents,
      adminUsers,
    });

    expect(snapshot).not.toBeNull();

    render(<CustomerDetailView snapshot={snapshot!} />);

    expect(screen.getByText("김민서 운영 상세")).toBeInTheDocument();
    expect(screen.getByText("결제 이력")).toBeInTheDocument();
    expect(screen.getByText("환불 이력")).toBeInTheDocument();
    expect(screen.getByText("쿠폰 이력")).toBeInTheDocument();
    expect(screen.getByText("감사 타임라인")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "결제 대응 화면 열기" }),
    ).toHaveAttribute("href", "/admin/payments");
    expect(screen.getByRole("link", { name: "pay_001" })).toHaveAttribute(
      "href",
      "/admin/payments/pay_001",
    );
  });
});
