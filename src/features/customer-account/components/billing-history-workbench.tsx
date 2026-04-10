"use client";

import { useDeferredValue, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import type { PaymentStatus } from "@/types/domain";

import {
  filterAndSortBillingRows,
  type CustomerBillingSnapshot,
} from "../lib/customer-account";

type BillingHistoryWorkbenchProps = {
  snapshot: CustomerBillingSnapshot;
};

const statusOptions: { label: string; value: PaymentStatus | "all" }[] = [
  { label: "전체 상태", value: "all" },
  { label: "결제 완료", value: "paid" },
  { label: "결제 실패", value: "failed" },
  { label: "환불", value: "refunded" },
  { label: "처리 중", value: "pending" },
];

export function BillingHistoryWorkbench({
  snapshot,
}: BillingHistoryWorkbenchProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"latest" | "amount">("latest");
  const deferredQuery = useDeferredValue(query);

  const rows = filterAndSortBillingRows(snapshot.rows, {
    query: deferredQuery,
    status,
    sortBy,
  });

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="고객 계정"
        title={`${snapshot.customer.name}님의 결제 내역`}
        description="청구 번호, 결제 상태, 결제 수단, 환불 여부를 고객 시점에서 이해하기 쉽게 정리했습니다."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.headlineCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            description={card.description}
          />
        ))}
      </section>

      {snapshot.issuePanel ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-slate-950">
              {snapshot.issuePanel.title}
            </h2>
            <StatusBadge
              label={snapshot.issuePanel.tone === "danger" ? "점검 필요" : "확인 권장"}
              tone={snapshot.issuePanel.tone}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {snapshot.issuePanel.description}
          </p>
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">청구 이력</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              청구 번호나 결제 수단으로 검색하고, 상태와 금액 기준으로 필요한 내역만 빠르게 찾을 수 있습니다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              청구 검색
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="INV-2404, 카드"
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              상태 필터
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as PaymentStatus | "all")}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              정렬
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as "latest" | "amount")}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              >
                <option value="latest">최신순</option>
                <option value="amount">금액 높은 순</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6">
          {rows.length > 0 ? (
            <TableShell
              title="최근 청구 내역"
              description={`${rows.length}건의 청구/결제 내역이 현재 필터 조건에 맞게 표시됩니다.`}
              columns={["청구 번호", "금액", "상태", "시도 일시", "결제 수단", "요약"]}
            >
              {rows.map((row) => (
                <tr
                  key={row.invoiceId}
                  className="border-t border-slate-200"
                >
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-950">
                        {row.invoiceNumber}
                      </span>
                      <span className="text-sm text-slate-600">{row.issuedAtLabel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top text-sm text-slate-600">
                    {row.amountLabel}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <StatusBadge
                      label={row.statusLabel}
                      tone={row.statusTone}
                    />
                  </td>
                  <td className="px-6 py-4 align-top text-sm text-slate-600">
                    {row.attemptedAtLabel}
                  </td>
                  <td className="px-6 py-4 align-top text-sm text-slate-600">
                    {row.methodLabel}
                  </td>
                  <td className="px-6 py-4 align-top text-sm leading-6 text-slate-600">
                    {row.summary}
                  </td>
                </tr>
              ))}
            </TableShell>
          ) : (
            <EmptyState
              title="조건에 맞는 청구 이력이 없습니다"
              description="검색어, 상태 필터, 정렬 조건을 조정하면 다른 결제 이력을 다시 확인할 수 있습니다."
            />
          )}
        </div>
      </section>
    </main>
  );
}
