"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import {
  paymentStatusMeta,
  subscriptionStatusMeta,
} from "@/lib/domain-meta";
import { formatDate } from "@/lib/format";
import {
  buildCustomerTableRows,
  filterAndSortCustomerTableRows,
  paginateCustomerTableRows,
  type CustomerTableSortKey,
} from "@/features/customers/lib/customer-table";
import type {
  Customer,
  Payment,
  Plan,
  Subscription,
  SubscriptionStatus,
} from "@/types/domain";

type CustomerOpsTableViewProps = {
  customers: Customer[];
  payments: Payment[];
  plans: Plan[];
  subscriptions: Subscription[];
};

const PAGE_SIZE = 2;

export function CustomerOpsTableView({
  customers,
  payments,
  plans,
  subscriptions,
}: CustomerOpsTableViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "all">(
    "all",
  );
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<CustomerTableSortKey>("customer_name");
  const [currentPage, setCurrentPage] = useState(1);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const rows = buildCustomerTableRows({
    customers,
    payments,
    plans,
    subscriptions,
  });
  const filteredRows = filterAndSortCustomerTableRows(rows, {
    planId: planFilter === "all" ? undefined : planFilter,
    query: deferredSearchQuery,
    sortBy,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const paginatedRows = paginateCustomerTableRows(
    filteredRows,
    currentPage,
    PAGE_SIZE,
  );

  const activeCount = subscriptions.filter((item) => item.status === "active").length;
  const attentionCount = subscriptions.filter(
    (item) =>
      item.status === "past_due" || item.status === "scheduled_for_cancel",
  ).length;
  const upcomingBillingCount = subscriptions.filter((item) => {
    if (!item.nextBillingDate) {
      return false;
    }

    return item.nextBillingDate <= "2026-04-30";
  }).length;

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="고객 운영"
        title="고객 운영 목록"
        description="검색, 필터, 정렬, 페이지네이션으로 고객을 빠르게 찾고 고객 상세 또는 구독 운영 화면으로 이어지는 운영 진입 화면입니다."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="관리 고객"
          value={`${rows.length}건`}
          description="현재 구독 데이터와 연결된 고객 계정 수입니다."
        />
        <StatCard
          label="즉시 확인 필요"
          value={`${attentionCount}건`}
          description="연체 또는 취소 예정 상태로 후속 조치가 필요한 고객입니다."
        />
        <StatCard
          label="이달 청구 예정"
          value={`${upcomingBillingCount}건`}
          description="이번 청구 주기 안에 결제 모니터링이 필요한 고객 수입니다."
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex-1">
            <span className="text-sm font-semibold text-slate-950">고객 검색</span>
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="이름, 이메일, 회사명으로 검색"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            />
          </label>

          <label className="lg:w-52">
            <span className="text-sm font-semibold text-slate-950">상태 필터</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as SubscriptionStatus | "all");
                setCurrentPage(1);
              }}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            >
              <option value="all">전체 상태</option>
              {Object.entries(subscriptionStatusMeta).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>

          <label className="lg:w-52">
            <span className="text-sm font-semibold text-slate-950">플랜 필터</span>
            <select
              value={planFilter}
              onChange={(event) => {
                setPlanFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            >
              <option value="all">전체 플랜</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </label>

          <label className="lg:w-52">
            <span className="text-sm font-semibold text-slate-950">정렬 기준</span>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as CustomerTableSortKey)
              }
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            >
              <option value="customer_name">고객명</option>
              <option value="latest_payment">최근 결제</option>
              <option value="next_billing_date">다음 청구일</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span>필터 결과 {paginatedRows.totalRows}건</span>
          <span>
            {paginatedRows.currentPage} / {paginatedRows.totalPages} 페이지
          </span>
          <span>활성 구독 {activeCount}건</span>
        </div>
      </section>

      {rows.length > 0 ? (
        <TableShell
          title="고객 운영 테이블"
          description="고객을 먼저 찾고 상세 확인 또는 구독 상태 변경 화면으로 이어지는 운영 중심 테이블입니다."
          columns={[
            "고객",
            "회사",
            "플랜",
            "구독 상태",
            "최근 결제",
            "다음 청구",
            "작업",
          ]}
        >
          {paginatedRows.pageRows.length > 0 ? (
            paginatedRows.pageRows.map((row) => {
              const subscriptionMeta = subscriptionStatusMeta[row.subscription.status];
              const paymentMeta = row.latestPayment
                ? paymentStatusMeta[row.latestPayment.status]
                : { label: "결제 없음", tone: "neutral" as const };

              return (
                <tr key={row.subscription.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <Link
                      href={`/admin/customers/${row.customer.id}`}
                      className="font-medium text-slate-950 transition hover:text-slate-700 hover:underline"
                    >
                      {row.customer.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">{row.customer.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {row.customer.company}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {row.plan?.name ?? "플랜 미정"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <StatusBadge
                      label={subscriptionMeta.label}
                      tone={subscriptionMeta.tone}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <StatusBadge
                      label={paymentMeta.label}
                      tone={paymentMeta.tone}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {row.subscription.nextBillingDate
                      ? formatDate(row.subscription.nextBillingDate)
                      : "일정 없음"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/customers/${row.customer.id}`}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        고객 상세
                      </Link>
                      <Link
                        href="/admin/subscriptions"
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                      >
                        구독 운영
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="border-t border-slate-200">
              <td className="px-6 py-8" colSpan={7}>
                <EmptyState
                  title="조건에 맞는 고객이 없습니다"
                  description="검색어를 조정하거나 필터를 초기화해 다른 고객을 찾아보세요."
                />
              </td>
            </tr>
          )}
        </TableShell>
      ) : (
        <EmptyState
          title="표시할 고객 데이터가 없습니다"
          description="고객과 구독 데이터가 준비되면 여기에서 운영 대상을 탐색할 수 있습니다."
        />
      )}

      {filteredRows.length > 0 ? (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <p className="text-sm text-slate-600">
            페이지 {paginatedRows.currentPage} / {paginatedRows.totalPages}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={paginatedRows.currentPage === 1}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전
            </button>
            {Array.from({ length: paginatedRows.totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    page === paginatedRows.currentPage
                      ? "bg-slate-950 text-white"
                      : "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(paginatedRows.totalPages, page + 1))
              }
              disabled={paginatedRows.currentPage === paginatedRows.totalPages}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
