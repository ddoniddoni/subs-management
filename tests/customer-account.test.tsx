import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { BillingHistoryWorkbench } from "@/features/customer-account/components/billing-history-workbench";
import { CustomerSubscriptionCenter } from "@/features/customer-account/components/customer-subscription-center";
import {
  filterAndSortBillingRows,
  getCustomerBillingSnapshot,
  getCustomerSubscriptionSnapshot,
} from "@/features/customer-account/lib/customer-account";
import {
  coupons,
  currentCustomerId,
  customers,
  invoices,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

describe("customer account helpers", () => {
  it("builds a rich subscription snapshot for the current customer", () => {
    const snapshot = getCustomerSubscriptionSnapshot({
      coupons,
      customerId: currentCustomerId,
      customers,
      invoices,
      payments,
      plans,
      refunds,
      subscriptions,
    });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.customer.name).toBe("김민서");
    expect(snapshot?.plan.id).toBe("plan_pro");
    expect(snapshot?.timeline.length).toBeGreaterThan(0);
    expect(snapshot?.actions).toHaveLength(3);
  });

  it("filters and sorts billing rows by status and amount", () => {
    const snapshot = getCustomerBillingSnapshot({
      customerId: currentCustomerId,
      customers,
      invoices,
      payments,
      refunds,
    });

    expect(snapshot).not.toBeNull();

    const rows = filterAndSortBillingRows(snapshot!.rows, {
      query: "",
      status: "failed",
      sortBy: "amount",
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]?.status).toBe("failed");
    expect(rows[0]?.invoiceNumber).toBe("INV-240201");
  });
});

describe("customer account views", () => {
  it("renders subscription timeline and self-service actions", () => {
    const snapshot = getCustomerSubscriptionSnapshot({
      coupons,
      customerId: currentCustomerId,
      customers,
      invoices,
      payments,
      plans,
      refunds,
      subscriptions,
    });

    expect(snapshot).not.toBeNull();

    render(<CustomerSubscriptionCenter snapshot={snapshot!} />);

    expect(screen.getByText("김민서님의 구독 센터")).toBeInTheDocument();
    expect(screen.getByText("구독 타임라인")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "결제 내역 보기" })).toHaveAttribute(
      "href",
      "/app/billing",
    );
  });

  it("filters billing history interactively", async () => {
    const user = userEvent.setup();
    const snapshot = getCustomerBillingSnapshot({
      customerId: currentCustomerId,
      customers,
      invoices,
      payments,
      refunds,
    });

    expect(snapshot).not.toBeNull();

    render(<BillingHistoryWorkbench snapshot={snapshot!} />);

    const billingSection = screen
      .getByRole("heading", { name: "최근 청구 내역" })
      .closest("section");

    expect(billingSection).not.toBeNull();
    expect(within(billingSection!).getByText("INV-240401")).toBeInTheDocument();
    expect(within(billingSection!).getByText("INV-240201")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("상태 필터"), "failed");

    expect(within(billingSection!).getByText("INV-240201")).toBeInTheDocument();
    expect(within(billingSection!).queryByText("INV-240401")).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("상태 필터"), "all");
    await user.type(screen.getByLabelText("청구 검색"), "2403");

    expect(within(billingSection!).getByText("INV-240301")).toBeInTheDocument();
    expect(within(billingSection!).queryByText("INV-240401")).not.toBeInTheDocument();
  });
});
