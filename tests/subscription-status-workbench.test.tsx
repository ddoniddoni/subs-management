import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SubscriptionStatusWorkbench } from "@/features/customers/components/subscription-status-workbench";
import {
  auditEvents,
  coupons,
  customers,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

function renderWorkbench() {
  render(
    <SubscriptionStatusWorkbench
      auditEvents={auditEvents}
      coupons={coupons}
      customers={customers}
      payments={payments}
      plans={plans}
      refunds={refunds}
      subscriptions={subscriptions}
    />,
  );
}

function expectStatValue(label: string, value: string) {
  const card = screen.getAllByText(label)[0]?.closest("article");

  expect(card).not.toBeNull();
  expect(within(card!).getByText(value)).toBeInTheDocument();
}

describe("SubscriptionStatusWorkbench", () => {
  it("supports search, filters, sorting, and pagination in the subscription table", async () => {
    const user = userEvent.setup();

    renderWorkbench();

    const subscriptionTable = screen
      .getByRole("heading", { name: "구독 운영 대상" })
      .closest("section");

    expect(subscriptionTable).not.toBeNull();
    expect(screen.getByText("1 / 2 페이지")).toBeInTheDocument();
    expect(within(subscriptionTable!).getByText("minseo@teamfit.kr")).toBeInTheDocument();
    expect(within(subscriptionTable!).getByText("seojun@solohealth.kr")).toBeInTheDocument();
    expect(
      within(subscriptionTable!).queryByText("doyoon@brightops.kr"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByText("2 / 2 페이지")).toBeInTheDocument();
    expect(within(subscriptionTable!).getByText("doyoon@brightops.kr")).toBeInTheDocument();
    expect(
      within(subscriptionTable!).queryByText("minseo@teamfit.kr"),
    ).not.toBeInTheDocument();

    const [statusFilter, planFilter, sortBy] = screen.getAllByRole("combobox");

    await user.click(screen.getByRole("button", { name: "1" }));
    await user.selectOptions(sortBy!, "latest_payment");

    expect(screen.getByText("1 / 2 페이지")).toBeInTheDocument();
    expect(within(subscriptionTable!).getByText("doyoon@brightops.kr")).toBeInTheDocument();
    expect(within(subscriptionTable!).getByText("minseo@teamfit.kr")).toBeInTheDocument();

    await user.selectOptions(statusFilter!, "past_due");

    expect(within(subscriptionTable!).getByText("doyoon@brightops.kr")).toBeInTheDocument();
    expect(
      within(subscriptionTable!).queryByText("minseo@teamfit.kr"),
    ).not.toBeInTheDocument();

    await user.selectOptions(statusFilter!, "all");
    await user.selectOptions(planFilter!, "plan_starter");

    expect(within(subscriptionTable!).getByText("seojun@solohealth.kr")).toBeInTheDocument();
    expect(
      within(subscriptionTable!).queryByText("doyoon@brightops.kr"),
    ).not.toBeInTheDocument();
  });

  it("requires an action reason before confirming a status change", async () => {
    const user = userEvent.setup();

    renderWorkbench();

    await user.click(screen.getByRole("button", { name: /^일시 중지/ }));
    await user.click(screen.getByRole("button", { name: "일시 중지 적용" }));

    expect(screen.getByText("상태 변경 사유를 8자 이상 입력해 주세요.")).toBeInTheDocument();
    expectStatValue("활성 구독", "1건");
  });

  it("shows related payment, refund, and coupon context and records the action reason", async () => {
    const user = userEvent.setup();

    renderWorkbench();

    const [statusFilter] = screen.getAllByRole("combobox");
    await user.selectOptions(statusFilter!, "past_due");

    expect(screen.getAllByText("검토 중 환불").length).toBeGreaterThan(0);
    expect(screen.getByText("pay_004")).toBeInTheDocument();
    expect(screen.getByText("refund_002")).toBeInTheDocument();
    expect(screen.getByText("SAVE-10000")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^정상 복구/ }));
    await user.type(
      screen.getByLabelText("상태 변경 사유"),
      "결제 실패 고객 확인 완료",
    );
    await user.click(screen.getByRole("button", { name: "정상 상태로 복구" }));

    expect(
      screen.getAllByText("이도윤 고객의 구독 상태를 결제 지연에서 활성(으)로 변경했습니다.")
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("subscription · sub_002 · 사유: 결제 실패 고객 확인 완료")).toBeInTheDocument();
    expect(screen.getByText("조건에 맞는 구독이 없습니다")).toBeInTheDocument();
    expectStatValue("활성 구독", "2건");
  });
});
