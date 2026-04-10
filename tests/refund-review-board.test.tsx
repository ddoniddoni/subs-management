import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RefundReviewBoard } from "@/features/refunds/components/refund-review-board";
import { auditEvents, customers, payments, refunds } from "@/mocks/subscription-data";

function expectStatValue(label: string, value: string) {
  const card = screen.getAllByText(label)[0]?.closest("article");

  expect(card).not.toBeNull();
  expect(within(card!).getByText(value)).toBeInTheDocument();
}

describe("RefundReviewBoard", () => {
  it("approves a requested refund and preserves the review comment", async () => {
    const user = userEvent.setup();

    render(
      <RefundReviewBoard
        auditEvents={auditEvents}
        customers={customers}
        payments={payments}
        refunds={refunds}
      />,
    );

    await user.click(screen.getByRole("button", { name: "승인 준비" }));
    await user.type(
      screen.getByLabelText("검토 메모"),
      "서비스 장애 보상 기준을 충족해 승인합니다.",
    );
    await user.click(screen.getByRole("button", { name: "처리 확인" }));

    expect(
      screen.getAllByText("이도윤의 환불 요청을 승인했습니다."),
    ).toHaveLength(2);
    expect(
      screen.getByText("이미 처리된 환불 요청입니다"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("서비스 장애 보상 기준을 충족해 승인합니다."),
    ).toBeInTheDocument();
    expectStatValue("검토 대기", "0건");
    expectStatValue("승인 완료", "2건");
  });
});
