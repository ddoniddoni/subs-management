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

    await user.click(screen.getByRole("button", { name: /일시 중지/ }));
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
