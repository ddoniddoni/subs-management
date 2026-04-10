import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CouponOperationsWorkbench } from "@/features/coupons/components/coupon-operations-workbench";
import {
  buildCouponTableRows,
  filterAndSortCouponTableRows,
  paginateCouponTableRows,
} from "@/features/coupons/lib/coupon-operations";
import { auditEvents, coupons, customers } from "@/mocks/subscription-data";

describe("coupon operation helpers", () => {
  it("filters coupon rows by query and status", () => {
    const rows = buildCouponTableRows({ coupons, customers });

    const filteredRows = filterAndSortCouponTableRows(rows, {
      query: "save",
      status: "scheduled",
      sortBy: "code",
    });

    expect(filteredRows).toHaveLength(1);
    expect(filteredRows[0]?.coupon.code).toBe("SAVE-10000");
  });

  it("sorts by customer and paginates rows", () => {
    const rows = buildCouponTableRows({ coupons, customers });
    const sortedRows = filterAndSortCouponTableRows(rows, {
      sortBy: "customer_name",
      status: "all",
    });
    const paginated = paginateCouponTableRows(sortedRows, 2, 2);

    expect(sortedRows[0]?.customer?.name).toBe("김민서");
    expect(paginated.totalPages).toBe(2);
    expect(paginated.pageRows).toHaveLength(1);
  });
});

describe("CouponOperationsWorkbench", () => {
  it("supports filtering and pagination in the coupon table", async () => {
    const user = userEvent.setup();

    render(
      <CouponOperationsWorkbench
        auditEvents={auditEvents}
        coupons={coupons}
        customers={customers}
      />,
    );

    const couponTable = screen
      .getByRole("heading", { name: "쿠폰 목록" })
      .closest("section");

    expect(couponTable).not.toBeNull();
    expect(screen.getByText("1 / 2 페이지")).toBeInTheDocument();
    expect(within(couponTable!).getByText("PAUSE-BACK")).toBeInTheDocument();
    expect(within(couponTable!).getByText("SAVE-10000")).toBeInTheDocument();
    expect(within(couponTable!).queryByText("WELCOME-20")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByText("2 / 2 페이지")).toBeInTheDocument();
    expect(within(couponTable!).getByText("WELCOME-20")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("상태 필터"), "scheduled");
    expect(within(couponTable!).getByText("SAVE-10000")).toBeInTheDocument();
    expect(within(couponTable!).queryByText("WELCOME-20")).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText("쿠폰 검색"));
    await user.type(screen.getByLabelText("쿠폰 검색"), "pause");
    await user.selectOptions(screen.getByLabelText("상태 필터"), "all");
    expect(within(couponTable!).getByText("PAUSE-BACK")).toBeInTheDocument();
  });

  it("issues a coupon and then revokes the selected coupon", async () => {
    const user = userEvent.setup();

    render(
      <CouponOperationsWorkbench
        auditEvents={auditEvents}
        coupons={coupons}
        customers={customers}
      />,
    );

    await user.type(screen.getByLabelText("쿠폰 제목"), "결제 실패 보상");
    await user.type(screen.getByLabelText("쿠폰 코드"), "retry-25");
    await user.selectOptions(screen.getByLabelText("대상 고객"), "cust_002");
    await user.type(screen.getByLabelText("할인 값"), "25");
    await user.click(screen.getByRole("button", { name: "쿠폰 발급" }));

    expect(
      screen.getAllByText("RETRY-25 쿠폰을 이도윤 계정에 발급했습니다."),
    ).toHaveLength(1);
    expect(screen.getByText("RETRY-25")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "회수 준비" }));
    await user.click(screen.getByRole("button", { name: "회수 확인" }));

    expect(screen.getAllByText("RETRY-25 쿠폰을 회수했습니다.")).toHaveLength(2);
    expect(screen.getByText("회수 대상이 아닙니다")).toBeInTheDocument();
  });
});
