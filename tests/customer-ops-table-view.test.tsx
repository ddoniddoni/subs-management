import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CustomerOpsTableView } from "@/features/customers/components/customer-ops-table-view";
import {
  customers,
  payments,
  plans,
  subscriptions,
} from "@/mocks/subscription-data";

describe("CustomerOpsTableView", () => {
  it("supports search, filters, sorting, and pagination for the customer table", async () => {
    const user = userEvent.setup();

    render(
      <CustomerOpsTableView
        customers={customers}
        payments={payments}
        plans={plans}
        subscriptions={subscriptions}
      />,
    );

    const customerTable = screen
      .getByRole("heading", { name: "고객 운영 테이블" })
      .closest("section");

    expect(customerTable).not.toBeNull();
    expect(screen.getByText("1 / 2 페이지")).toBeInTheDocument();
    expect(within(customerTable!).getByText("minseo@teamfit.kr")).toBeInTheDocument();
    expect(within(customerTable!).getByText("seojun@solohealth.kr")).toBeInTheDocument();
    expect(
      within(customerTable!).queryByText("doyoon@brightops.kr"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByText("2 / 2 페이지")).toBeInTheDocument();
    expect(within(customerTable!).getByText("doyoon@brightops.kr")).toBeInTheDocument();
    expect(
      within(customerTable!).queryByText("minseo@teamfit.kr"),
    ).not.toBeInTheDocument();

    const [statusFilter, planFilter, sortBy] = screen.getAllByRole("combobox");

    await user.click(screen.getByRole("button", { name: "1" }));
    await user.selectOptions(sortBy!, "latest_payment");

    expect(screen.getByText("1 / 2 페이지")).toBeInTheDocument();
    expect(within(customerTable!).getByText("doyoon@brightops.kr")).toBeInTheDocument();
    expect(within(customerTable!).getByText("minseo@teamfit.kr")).toBeInTheDocument();

    await user.selectOptions(statusFilter!, "past_due");

    expect(within(customerTable!).getByText("doyoon@brightops.kr")).toBeInTheDocument();
    expect(
      within(customerTable!).queryByText("minseo@teamfit.kr"),
    ).not.toBeInTheDocument();

    await user.selectOptions(statusFilter!, "all");
    await user.selectOptions(planFilter!, "plan_starter");

    expect(within(customerTable!).getByText("seojun@solohealth.kr")).toBeInTheDocument();
    expect(
      within(customerTable!).queryByText("doyoon@brightops.kr"),
    ).not.toBeInTheDocument();

    await user.clear(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "teamfit");
    await user.selectOptions(planFilter!, "all");

    expect(within(customerTable!).getByText("minseo@teamfit.kr")).toBeInTheDocument();
    expect(
      within(customerTable!).queryByText("seojun@solohealth.kr"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "구독 운영" })[0]).toHaveAttribute(
      "href",
      "/admin/subscriptions",
    );
  });
});
