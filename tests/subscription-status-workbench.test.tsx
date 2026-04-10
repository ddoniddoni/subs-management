import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SubscriptionStatusWorkbench } from "@/features/customers/components/subscription-status-workbench";
import {
  auditEvents,
  customers,
  payments,
  plans,
  subscriptions,
} from "@/mocks/subscription-data";

function expectStatValue(label: string, value: string) {
  const card = screen.getAllByText(label)[0]?.closest("article");

  expect(card).not.toBeNull();
  expect(within(card!).getByText(value)).toBeInTheDocument();
}

describe("SubscriptionStatusWorkbench", () => {
  it("supports search, filters, sorting, and pagination in the customer table", async () => {
    const user = userEvent.setup();

    render(
      <SubscriptionStatusWorkbench
        auditEvents={auditEvents}
        customers={customers}
        plans={plans}
        subscriptions={subscriptions}
        payments={payments}
      />,
    );

    const customerTable = screen
      .getByRole("heading", { name: "고객 구독 목록" })
      .closest("section");

    expect(customerTable).not.toBeNull();
    expect(screen.getByText("1 / 2 페이지")).toBeInTheDocument();
    expect(within(customerTable!).getByText("김민서")).toBeInTheDocument();
    expect(within(customerTable!).getByText("박서준")).toBeInTheDocument();
    expect(within(customerTable!).queryByText("이도윤")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByText("2 / 2 페이지")).toBeInTheDocument();
    expect(within(customerTable!).getByText("이도윤")).toBeInTheDocument();
    expect(within(customerTable!).queryByText("김민서")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "1" }));
    await user.selectOptions(screen.getByLabelText("정렬 기준"), "latest_payment");

    expect(screen.getByText("1 / 2 페이지")).toBeInTheDocument();
    expect(within(customerTable!).getByText("이도윤")).toBeInTheDocument();
    expect(within(customerTable!).getByText("김민서")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("상태 필터"), "past_due");

    expect(within(customerTable!).getByText("이도윤")).toBeInTheDocument();
    expect(within(customerTable!).queryByText("김민서")).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText("고객 검색"));
    await user.type(screen.getByLabelText("고객 검색"), "솔로헬스");
    await user.selectOptions(screen.getByLabelText("상태 필터"), "all");

    expect(within(customerTable!).getByText("박서준")).toBeInTheDocument();
    expect(within(customerTable!).queryByText("이도윤")).not.toBeInTheDocument();
  });

  it("changes a subscription status after confirmation and records the activity", async () => {
    const user = userEvent.setup();

    render(
      <SubscriptionStatusWorkbench
        auditEvents={auditEvents}
        customers={customers}
        plans={plans}
        subscriptions={subscriptions}
        payments={payments}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: /일시 중지/ })[0]!);
    await user.click(screen.getByRole("button", { name: "변경 확인" }));

    expect(
      screen.getAllByText(
        "김민서의 구독 상태를 활성에서 일시 중지(으)로 변경했습니다.",
      ),
    ).toHaveLength(2);
    expect(screen.getByRole("button", { name: /재개/ })).toBeInTheDocument();
    expectStatValue("활성 구독", "0건");
  });
});
