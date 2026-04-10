import { describe, expect, it } from "vitest";

import {
  buildCustomerTableRows,
  filterAndSortCustomerTableRows,
  paginateCustomerTableRows,
} from "@/features/customers/lib/customer-table";
import { customers, payments, plans, subscriptions } from "@/mocks/subscription-data";

describe("customer table helpers", () => {
  it("filters rows by query and status", () => {
    const rows = buildCustomerTableRows({
      customers,
      payments,
      plans,
      subscriptions,
    });

    const filteredRows = filterAndSortCustomerTableRows(rows, {
      query: "브라이트",
      status: "past_due",
      sortBy: "customer_name",
    });

    expect(filteredRows).toHaveLength(1);
    expect(filteredRows[0]?.customer.name).toBe("이도윤");
  });

  it("sorts rows by next billing date and paginates them", () => {
    const rows = buildCustomerTableRows({
      customers,
      payments,
      plans,
      subscriptions,
    });

    const sortedRows = filterAndSortCustomerTableRows(rows, {
      sortBy: "next_billing_date",
    });
    const paginated = paginateCustomerTableRows(sortedRows, 2, 2);

    expect(sortedRows.map((row) => row.customer.name)).toEqual([
      "이도윤",
      "박서준",
      "김민서",
    ]);
    expect(paginated.pageRows).toHaveLength(1);
    expect(paginated.pageRows[0]?.customer.name).toBe("김민서");
  });
});
