import { couponStatusMeta } from "@/lib/domain-meta";
import { formatCurrency } from "@/lib/format";
import type { Coupon, CouponStatus, Customer } from "@/types/domain";

type CouponTableRow = {
  coupon: Coupon;
  customer: Customer | null;
  discountLabel: string;
};

type CouponTableFilter = {
  query?: string;
  sortBy?: CouponTableSortKey;
  status?: CouponStatus | "all";
};

type CouponTableSortKey = "expires_at" | "code" | "customer_name" | "status";

export function buildCouponTableRows({
  coupons,
  customers,
}: {
  coupons: Coupon[];
  customers: Customer[];
}) {
  return coupons.map((coupon) => ({
    coupon,
    customer:
      customers.find((customer) => customer.id === coupon.assignedCustomerId) ?? null,
    discountLabel:
      coupon.discountType === "percent"
        ? `${coupon.discountValue}% 할인`
        : formatCurrency(coupon.discountValue),
  }));
}

export function filterAndSortCouponTableRows(
  rows: CouponTableRow[],
  filter: CouponTableFilter,
) {
  const normalizedQuery = filter.query?.trim().toLocaleLowerCase("ko-KR") ?? "";

  return rows
    .filter((row) => {
      if (normalizedQuery) {
        const haystacks = [
          row.coupon.code,
          row.coupon.title,
          row.customer?.name ?? "",
          row.customer?.email ?? "",
          row.customer?.company ?? "",
        ].map((value) => value.toLocaleLowerCase("ko-KR"));

        if (!haystacks.some((value) => value.includes(normalizedQuery))) {
          return false;
        }
      }

      if (filter.status && filter.status !== "all") {
        return row.coupon.status === filter.status;
      }

      return true;
    })
    .toSorted((left, right) => {
      switch (filter.sortBy) {
        case "code":
          return left.coupon.code.localeCompare(right.coupon.code, "en");
        case "customer_name":
          return (left.customer?.name ?? "zzzz").localeCompare(
            right.customer?.name ?? "zzzz",
            "ko-KR",
          );
        case "status":
          return couponStatusMeta[left.coupon.status].label.localeCompare(
            couponStatusMeta[right.coupon.status].label,
            "ko-KR",
          );
        case "expires_at":
        default:
          return left.coupon.expiresAt.localeCompare(right.coupon.expiresAt);
      }
    });
}

export function paginateCouponTableRows(
  rows: CouponTableRow[],
  currentPage: number,
  pageSize: number,
) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    currentPage: safePage,
    pageRows: rows.slice(startIndex, startIndex + pageSize),
    totalPages,
    totalRows: rows.length,
  };
}

export function summarizeCoupons(coupons: Coupon[]) {
  return {
    activeCount: `${coupons.filter((coupon) => coupon.status === "active").length}건`,
    scheduledCount: `${coupons.filter((coupon) => coupon.status === "scheduled").length}건`,
    revokedCount: `${coupons.filter((coupon) => coupon.status === "revoked").length}건`,
    expiringSoonCount: `${
      coupons.filter((coupon) => {
        const diff =
          new Date(coupon.expiresAt).getTime() - new Date("2026-04-10").getTime();

        return diff >= 0 && diff <= 1000 * 60 * 60 * 24 * 30;
      }).length
    }건`,
  };
}

export function canRevokeCoupon(status: CouponStatus) {
  return status === "active" || status === "scheduled";
}

export type { CouponTableFilter, CouponTableRow, CouponTableSortKey };
