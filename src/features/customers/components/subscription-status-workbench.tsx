"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";

import { ActionActivityFeed } from "@/components/shared/action-activity-feed";
import { ActionFeedbackBanner } from "@/components/shared/action-feedback-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import {
  couponStatusMeta,
  paymentStatusMeta,
  refundStatusMeta,
  subscriptionStatusMeta,
} from "@/lib/domain-meta";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { mapAuditEventsToActivityItems } from "@/lib/workflow-activity";
import {
  filterAndSortCustomerTableRows,
  paginateCustomerTableRows,
  type CustomerTableSortKey,
} from "@/features/customers/lib/customer-table";
import {
  buildSubscriptionChangeDetail,
  buildSubscriptionChangeSummary,
  buildSubscriptionContextSnapshot,
  buildSubscriptionRows,
  getSubscriptionTransitionOptions,
  validateSubscriptionTransition,
} from "@/features/customers/lib/subscription-ops";
import type {
  AuditEvent,
  Coupon,
  Customer,
  Payment,
  Plan,
  Refund,
  Subscription,
  SubscriptionStatus,
} from "@/types/domain";

type SubscriptionStatusWorkbenchProps = {
  auditEvents: AuditEvent[];
  coupons: Coupon[];
  customers: Customer[];
  payments: Payment[];
  plans: Plan[];
  refunds: Refund[];
  subscriptions: Subscription[];
};

type FeedbackState = {
  message: string;
  tone: "danger" | "success";
  title?: string;
};

const PAGE_SIZE = 2;

export function SubscriptionStatusWorkbench({
  auditEvents,
  coupons,
  customers,
  payments,
  plans,
  refunds,
  subscriptions,
}: SubscriptionStatusWorkbenchProps) {
  const [localSubscriptions, setLocalSubscriptions] = useState(subscriptions);
  const [focusedSubscriptionId, setFocusedSubscriptionId] = useState(
    subscriptions[0]?.id ?? "",
  );
  const [nextStatus, setNextStatus] = useState<SubscriptionStatus | null>(null);
  const [changeReason, setChangeReason] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "all">(
    "all",
  );
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<CustomerTableSortKey>("customer_name");
  const [currentPage, setCurrentPage] = useState(1);
  const [activityItems, setActivityItems] = useState(() =>
    mapAuditEventsToActivityItems(
      auditEvents.filter((event) => event.entityType === "subscription"),
    ),
  );
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const rows = buildSubscriptionRows({
    customers,
    payments,
    plans,
    subscriptions: localSubscriptions,
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
  const selectedRow =
    filteredRows.find((row) => row.subscription.id === focusedSubscriptionId) ??
    paginatedRows.pageRows[0] ??
    null;
  const selectedSnapshot = selectedRow
    ? buildSubscriptionContextSnapshot({
        coupons,
        customerTableRows: rows,
        payments,
        refunds,
        subscriptionId: selectedRow.subscription.id,
      })
    : null;
  const transitionOptions = selectedSnapshot
    ? getSubscriptionTransitionOptions(selectedSnapshot.row.subscription.status)
    : [];

  const activeCount = localSubscriptions.filter(
    (item) => item.status === "active",
  ).length;
  const pastDueCount = localSubscriptions.filter(
    (item) => item.status === "past_due",
  ).length;
  const scheduledCancelCount = localSubscriptions.filter(
    (item) => item.status === "scheduled_for_cancel",
  ).length;
  const requestedRefundCount = refunds.filter(
    (refund) => refund.status === "requested",
  ).length;

  function clearInlineError() {
    setFeedback((current) => (current?.tone === "danger" ? null : current));
  }

  function resetPendingAction(nextSubscriptionId?: string) {
    startTransition(() => {
      if (nextSubscriptionId) {
        setFocusedSubscriptionId(nextSubscriptionId);
      }
      setNextStatus(null);
      setChangeReason("");
      clearInlineError();
    });
  }

  function handleConfirmStatusChange() {
    if (!selectedSnapshot || !nextStatus) {
      return;
    }

    const validationMessage = validateSubscriptionTransition({
      currentStatus: selectedSnapshot.row.subscription.status,
      nextStatus,
      reason: changeReason,
    });

    if (validationMessage) {
      setFeedback({
        tone: "danger",
        title: "변경 실패",
        message: validationMessage,
      });
      return;
    }

    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    const summary = buildSubscriptionChangeSummary({
      customerName: selectedSnapshot.row.customer.name,
      nextStatus,
      previousStatus: selectedSnapshot.row.subscription.status,
    });
    const detail = buildSubscriptionChangeDetail({
      reason: changeReason,
      subscriptionId: selectedSnapshot.row.subscription.id,
    });

    startTransition(() => {
      setLocalSubscriptions((current) =>
        current.map((subscription) =>
          subscription.id === selectedSnapshot.row.subscription.id
            ? {
                ...subscription,
                status: nextStatus,
                cancelAt:
                  nextStatus === "scheduled_for_cancel" || nextStatus === "canceled"
                    ? subscription.nextBillingDate ?? today
                    : null,
                nextBillingDate:
                  nextStatus === "canceled"
                    ? null
                    : subscription.nextBillingDate ?? today,
              }
            : subscription,
        ),
      );
      setFeedback({
        tone: "success",
        title: "상태 변경 완료",
        message: summary,
      });
      setActivityItems((current) => [
        {
          id: `subscription-${selectedSnapshot.row.subscription.id}-${now}`,
          occurredAt: now,
          summary,
          detail,
        },
        ...current,
      ]);
      setNextStatus(null);
      setChangeReason("");
      setFocusedSubscriptionId(selectedSnapshot.row.subscription.id);
    });
  }

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="구독 상태 운영 워크벤치"
        description="구독 상태를 안전하게 변경하고, 결제 실패·환불 요청·보상 쿠폰 같은 주변 운영 맥락을 함께 보면서 판단하는 관리자 화면입니다."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="활성 구독"
          value={`${activeCount}건`}
          description="정상 운영 중인 구독 수입니다."
        />
        <StatCard
          label="결제 지연"
          value={`${pastDueCount}건`}
          description="후속 대응이 필요한 연체 상태 구독 수입니다."
        />
        <StatCard
          label="해지 예약"
          value={`${scheduledCancelCount}건`}
          description="리텐션 확인이 필요한 해지 예정 구독 수입니다."
        />
        <StatCard
          label="검토 중 환불"
          value={`${requestedRefundCount}건`}
          description="구독 판단에 영향을 줄 수 있는 환불 요청 수입니다."
        />
      </section>

      {feedback ? (
        <ActionFeedbackBanner
          message={feedback.message}
          title={feedback.title}
          tone={feedback.tone}
        />
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex-1">
            <span className="text-sm font-semibold text-slate-950">고객 검색</span>
            <input
              value={searchQuery}
              onChange={(event) => {
                const nextValue = event.target.value;

                startTransition(() => {
                  setSearchQuery(nextValue);
                  setCurrentPage(1);
                });
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
                const nextValue = event.target.value as SubscriptionStatus | "all";

                startTransition(() => {
                  setStatusFilter(nextValue);
                  setCurrentPage(1);
                });
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
                const nextValue = event.target.value;

                startTransition(() => {
                  setPlanFilter(nextValue);
                  setCurrentPage(1);
                });
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
              onChange={(event) => {
                const nextValue = event.target.value as CustomerTableSortKey;

                startTransition(() => {
                  setSortBy(nextValue);
                  setCurrentPage(1);
                });
              }}
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
        </div>
      </section>

      {rows.length > 0 ? (
        <TableShell
          title="구독 운영 대상"
          description="대상을 먼저 찾고, 선택한 구독에 대해 상태 변경과 주변 운영 맥락을 함께 검토합니다."
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
                      <button
                        type="button"
                        onClick={() => resetPendingAction(row.subscription.id)}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        검토
                      </button>
                      <Link
                        href={`/admin/customers/${row.customer.id}`}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                      >
                        고객 상세
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
                  title="조건에 맞는 구독이 없습니다"
                  description="검색어를 조정하거나 필터를 초기화해 다른 구독 대상을 찾아보세요."
                />
              </td>
            </tr>
          )}
        </TableShell>
      ) : (
        <EmptyState
          title="표시할 구독 데이터가 없습니다"
          description="구독 데이터가 준비되면 여기에서 상태 변경 워크플로를 진행할 수 있습니다."
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
              onClick={() =>
                startTransition(() => {
                  setCurrentPage((page) => Math.max(1, page - 1));
                })
              }
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
                  onClick={() =>
                    startTransition(() => {
                      setCurrentPage(page);
                    })
                  }
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
                startTransition(() => {
                  setCurrentPage((page) =>
                    Math.min(paginatedRows.totalPages, page + 1),
                  );
                })
              }
              disabled={paginatedRows.currentPage === paginatedRows.totalPages}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </section>
      ) : null}

      {selectedSnapshot ? (
        <>
          <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                선택된 구독
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                {selectedSnapshot.row.customer.name}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {selectedSnapshot.row.customer.email}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {selectedSnapshot.row.customer.company} ·{" "}
                {selectedSnapshot.row.plan?.name ?? "플랜 미정"}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <StatusBadge
                  label={
                    subscriptionStatusMeta[selectedSnapshot.row.subscription.status].label
                  }
                  tone={
                    subscriptionStatusMeta[selectedSnapshot.row.subscription.status].tone
                  }
                />
                <StatusBadge
                  label={`${selectedSnapshot.row.subscription.seats}석 사용 중`}
                  tone="info"
                />
                {selectedSnapshot.row.subscription.nextBillingDate ? (
                  <StatusBadge
                    label={`다음 청구 ${formatDate(
                      selectedSnapshot.row.subscription.nextBillingDate,
                    )}`}
                    tone="neutral"
                  />
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {selectedSnapshot.riskItems.length > 0 ? (
                  selectedSnapshot.riskItems.map((riskItem) => (
                    <StatusBadge
                      key={riskItem.id}
                      label={riskItem.label}
                      tone={riskItem.tone}
                    />
                  ))
                ) : (
                  <StatusBadge label="추가 위험 신호 없음" tone="success" />
                )}
              </div>

              <div className="mt-8 space-y-3">
                {transitionOptions.map((option) => (
                  <button
                    key={option.nextStatus}
                    type="button"
                    onClick={() =>
                      startTransition(() => {
                        setNextStatus(option.nextStatus);
                        clearInlineError();
                      })
                    }
                    className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                      nextStatus === option.nextStatus
                        ? "border-slate-900 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-semibold">{option.label}</p>
                    <p className="mt-2 text-sm leading-6 text-inherit">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                변경 확인
              </p>

              {nextStatus ? (
                transitionOptions
                  .filter((option) => option.nextStatus === nextStatus)
                  .map((option) => (
                    <div key={option.nextStatus}>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold text-slate-950">
                          {subscriptionStatusMeta[nextStatus].label}로 변경
                        </h2>
                        <StatusBadge label={option.guardLabel} tone={option.guardTone} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {option.description}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {option.reasonHint}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <StatusBadge
                          label={`현재 ${
                            subscriptionStatusMeta[
                              selectedSnapshot.row.subscription.status
                            ].label
                          }`}
                          tone={
                            subscriptionStatusMeta[
                              selectedSnapshot.row.subscription.status
                            ].tone
                          }
                        />
                        <StatusBadge
                          label={`변경 후 ${subscriptionStatusMeta[nextStatus].label}`}
                          tone={subscriptionStatusMeta[nextStatus].tone}
                        />
                      </div>

                      <div className="mt-6">
                        <label
                          htmlFor="subscription-change-reason"
                          className="text-sm font-semibold text-slate-950"
                        >
                          상태 변경 사유
                        </label>
                        <textarea
                          id="subscription-change-reason"
                          value={changeReason}
                          onChange={(event) => {
                            setChangeReason(event.target.value);
                            clearInlineError();
                          }}
                          rows={4}
                          className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                          placeholder="운영 판단 근거와 고객 커뮤니케이션 내용을 남겨 주세요."
                        />
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleConfirmStatusChange}
                          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          {option.confirmLabel}
                        </button>
                        <button
                          type="button"
                          onClick={() => resetPendingAction()}
                          className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  왼쪽에서 전환할 상태를 먼저 선택하면 여기에서 확인 절차와 사유 입력을 진행할 수 있습니다.
                </p>
              )}
            </article>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                결제 컨텍스트
              </p>
              {selectedSnapshot.recentPayments.length > 0 ? (
                <>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {selectedSnapshot.latestPayment ? (
                      <>
                        <StatusBadge
                          label={
                            paymentStatusMeta[selectedSnapshot.latestPayment.status].label
                          }
                          tone={
                            paymentStatusMeta[selectedSnapshot.latestPayment.status].tone
                          }
                        />
                        <StatusBadge
                          label={formatCurrency(selectedSnapshot.latestPayment.amount)}
                          tone="info"
                        />
                      </>
                    ) : null}
                  </div>
                  <ol className="mt-6 space-y-3">
                    {selectedSnapshot.recentPayments.slice(0, 3).map((payment) => (
                      <li
                        key={payment.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <Link
                            href={`/admin/payments/${payment.id}`}
                            className="text-sm font-semibold text-slate-950 transition hover:text-slate-700 hover:underline"
                          >
                            {payment.id}
                          </Link>
                          <StatusBadge
                            label={paymentStatusMeta[payment.status].label}
                            tone={paymentStatusMeta[payment.status].tone}
                          />
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{payment.methodLabel}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {formatDateTime(payment.attemptedAt)}
                        </p>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    title="연결된 결제 이력이 없습니다"
                    description="결제 시도가 생기면 최근 결제 상태를 여기에서 함께 확인할 수 있습니다."
                  />
                </div>
              )}
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                환불 컨텍스트
              </p>
              {selectedSnapshot.recentRefunds.length > 0 ? (
                <ol className="mt-6 space-y-3">
                  {selectedSnapshot.recentRefunds.slice(0, 3).map((refund) => (
                    <li
                      key={refund.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Link
                          href={`/admin/refunds/${refund.id}`}
                          className="text-sm font-semibold text-slate-950 transition hover:text-slate-700 hover:underline"
                        >
                          {refund.id}
                        </Link>
                        <StatusBadge
                          label={refundStatusMeta[refund.status].label}
                          tone={refundStatusMeta[refund.status].tone}
                        />
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{refund.reason}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                        {formatDateTime(refund.requestedAt)}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    title="연결된 환불 요청이 없습니다"
                    description="환불 요청이 생기면 구독 판단에 필요한 맥락을 여기에서 확인할 수 있습니다."
                  />
                </div>
              )}
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                혜택 컨텍스트
              </p>
              {selectedSnapshot.activeCoupons.length > 0 ? (
                <ol className="mt-6 space-y-3">
                  {selectedSnapshot.activeCoupons.slice(0, 3).map((coupon) => (
                    <li
                      key={coupon.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-950">{coupon.code}</p>
                        <StatusBadge
                          label={couponStatusMeta[coupon.status].label}
                          tone={couponStatusMeta[coupon.status].tone}
                        />
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{coupon.title}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                        {formatDate(coupon.expiresAt)}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    title="연결된 쿠폰이 없습니다"
                    description="혜택이나 보상 정책이 적용되면 여기에서 함께 검토할 수 있습니다."
                  />
                </div>
              )}
            </article>
          </section>
        </>
      ) : null}

      <ActionActivityFeed
        title="구독 상태 변경 로그"
        description="기존 감사 이벤트와 이번 세션에서 처리한 상태 변경 이력을 함께 보여줍니다."
        emptyTitle="아직 기록된 상태 변경 이력이 없습니다"
        emptyDescription="구독 상태를 변경하면 최근 처리 이력이 바로 여기에 추가됩니다."
        items={activityItems}
      />
    </main>
  );
}
