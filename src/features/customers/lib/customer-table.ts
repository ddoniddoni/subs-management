import type {
  Customer,
  Payment,
  Plan,
  Subscription,
  SubscriptionStatus,
} from "@/types/domain";

type CustomerTableRow = {
  customer: Customer;
  latestPayment: Payment | null;
  plan: Plan | null;
  subscription: Subscription;
};

type CustomerTableFilter = {
  planId?: string;
  query?: string;
  sortBy?: CustomerTableSortKey;
  status?: SubscriptionStatus;
};

type CustomerTableSortKey =
  | "customer_name"
  | "latest_payment"
  | "next_billing_date";

export function buildCustomerTableRows({
  customers,
  payments,
  plans,
  subscriptions,
}: {
  customers: Customer[];
  payments: Payment[];
  plans: Plan[];
  subscriptions: Subscription[];
}) {
  return subscriptions.flatMap((subscription) => {
    const customer = customers.find((item) => item.id === subscription.customerId);

    if (!customer) {
      return [];
    }

    const latestPayment =
      payments
        .filter((item) => item.customerId === subscription.customerId)
        .toSorted((a, b) => b.attemptedAt.localeCompare(a.attemptedAt))[0] ?? null;

    return [
      {
        customer,
        latestPayment,
        plan: plans.find((item) => item.id === subscription.planId) ?? null,
        subscription,
      },
    ];
  });
}

export function filterAndSortCustomerTableRows(
  rows: CustomerTableRow[],
  filter: CustomerTableFilter,
) {
  const normalizedQuery = filter.query?.trim().toLocaleLowerCase("ko-KR") ?? "";

  return rows
    .filter((row) => {
      if (normalizedQuery) {
        const haystacks = [
          row.customer.name,
          row.customer.email,
          row.customer.company,
        ].map((value) => value.toLocaleLowerCase("ko-KR"));

        if (!haystacks.some((value) => value.includes(normalizedQuery))) {
          return false;
        }
      }

      if (filter.status && row.subscription.status !== filter.status) {
        return false;
      }

      if (filter.planId && row.subscription.planId !== filter.planId) {
        return false;
      }

      return true;
    })
    .toSorted((left, right) => {
      switch (filter.sortBy) {
        case "latest_payment":
          return (right.latestPayment?.attemptedAt ?? "").localeCompare(
            left.latestPayment?.attemptedAt ?? "",
          );
        case "next_billing_date":
          return (left.subscription.nextBillingDate ?? "9999-12-31").localeCompare(
            right.subscription.nextBillingDate ?? "9999-12-31",
          );
        case "customer_name":
        default:
          return left.customer.name.localeCompare(right.customer.name, "ko-KR");
      }
    });
}

export function paginateCustomerTableRows(
  rows: CustomerTableRow[],
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

export type { CustomerTableFilter, CustomerTableRow, CustomerTableSortKey };
