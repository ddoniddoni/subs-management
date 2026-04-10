import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CheckoutWorkbench } from "@/features/customer-acquisition/components/checkout-workbench";
import { CustomerLandingPageView } from "@/features/customer-acquisition/components/customer-landing-page-view";
import { PricingPlanExplorer } from "@/features/customer-acquisition/components/pricing-plan-explorer";
import {
  getCheckoutSummary,
  getCustomerAcquisitionSnapshot,
  validateCheckoutForm,
} from "@/features/customer-acquisition/lib/customer-acquisition";
import { plans } from "@/mocks/subscription-data";

describe("customer acquisition helpers", () => {
  it("builds plan catalog and annual checkout totals", () => {
    const snapshot = getCustomerAcquisitionSnapshot(plans);
    const summary = getCheckoutSummary(snapshot.planCatalog, {
      planCode: "pro",
      billingInterval: "annual",
      seats: 12,
      name: "민서",
      email: "minseo@teamfit.kr",
      company: "TeamFit",
      couponCode: "WELCOME-20",
    });

    expect(snapshot.planCatalog).toHaveLength(3);
    expect(snapshot.planCatalog.find((plan) => plan.code === "pro")?.recommended).toBe(true);
    expect(summary).not.toBeNull();
    expect(summary?.extraSeatCount).toBe(2);
    expect(summary?.discountAmount).toBeGreaterThan(0);
    expect(summary?.totalAmount).toBe(312000);
  });

  it("validates missing checkout fields and unsupported coupons", () => {
    const snapshot = getCustomerAcquisitionSnapshot(plans);
    const validation = validateCheckoutForm(snapshot.planCatalog, {
      planCode: "starter",
      billingInterval: "monthly",
      seats: 0,
      name: "A",
      email: "broken-email",
      company: "",
      couponCode: "INVALID",
    });

    expect(validation.ok).toBe(false);
    expect(validation.errors).toContain("담당자 이름을 2자 이상 입력해 주세요.");
    expect(validation.errors).toContain("지원하지 않는 프로모션 코드입니다.");
  });
});

describe("customer acquisition views", () => {
  it("renders landing CTA and faq content", () => {
    const snapshot = getCustomerAcquisitionSnapshot(plans);

    render(<CustomerLandingPageView snapshot={snapshot} />);

    expect(screen.getByText("결제부터 운영까지 이어지는 구독 시작 화면")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "요금제 비교하기" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(screen.getByText("도입 전에 자주 묻는 질문")).toBeInTheDocument();
  });

  it("switches pricing interval and updates checkout links", async () => {
    const user = userEvent.setup();
    const snapshot = getCustomerAcquisitionSnapshot(plans);

    render(<PricingPlanExplorer snapshot={snapshot} />);

    expect(screen.getByText("월간 결제 · 기본 10석 포함")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "연간 결제" }));

    expect(screen.getByText("연간 결제 · 2개월 할인 · 기본 10석 포함")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "이 플랜으로 checkout" })[1]).toHaveAttribute(
      "href",
      "/checkout?plan=pro&interval=annual",
    );
  });

  it("submits checkout and shows the success state", async () => {
    const user = userEvent.setup();
    const snapshot = getCustomerAcquisitionSnapshot(plans);

    render(
      <CheckoutWorkbench
        initialPlanCode="pro"
        planCatalog={snapshot.planCatalog}
      />,
    );

    await user.type(screen.getByLabelText("담당자 이름"), "김민서");
    await user.type(screen.getByLabelText("알림 이메일"), "minseo@teamfit.kr");
    await user.type(screen.getByLabelText("회사명"), "TeamFit");
    await user.clear(screen.getByLabelText("좌석 수"));
    await user.type(screen.getByLabelText("좌석 수"), "12");
    await user.type(screen.getByLabelText("프로모션 코드"), "welcome-20");
    await user.click(screen.getByRole("button", { name: "주문 시작" }));

    expect(await screen.findByText("주문 완료")).toBeInTheDocument();
    expect(screen.getByText("TeamFit 워크스페이스가 준비되었습니다")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "내 구독 보기" })).toHaveAttribute(
      "href",
      "/app/subscription",
    );
  });
});
