import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PaymentFailureWorkbench } from "@/features/payments/components/payment-failure-workbench";
import { auditEvents, customers, payments } from "@/mocks/subscription-data";

function expectStatValue(label: string, value: string) {
  const card = screen.getAllByText(label)[0]?.closest("article");

  expect(card).not.toBeNull();
  expect(within(card!).getByText(value)).toBeInTheDocument();
}

describe("PaymentFailureWorkbench", () => {
  it("marks a failed payment as pending and logs the response", async () => {
    const user = userEvent.setup();

    render(
      <PaymentFailureWorkbench
        auditEvents={auditEvents}
        customers={customers}
        payments={payments}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /재시도 예정으로 변경/ }),
    );
    await user.click(screen.getByRole("button", { name: "처리 확인" }));

    expect(
      screen.getAllByText("pay_003 결제 건을 처리 중 상태로 업데이트했습니다."),
    ).toHaveLength(2);
    expectStatValue("실패 결제", "1건");
    expectStatValue("재시도 예정", "1건");
  });
});
