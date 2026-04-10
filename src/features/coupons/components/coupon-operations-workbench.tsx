"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ActionActivityFeed } from "@/components/shared/action-activity-feed";
import { ActionFeedbackBanner } from "@/components/shared/action-feedback-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { couponStatusMeta } from "@/lib/domain-meta";
import { formatDate } from "@/lib/format";
import { mapAuditEventsToActivityItems } from "@/lib/workflow-activity";
import type { AuditEvent, Coupon, Customer } from "@/types/domain";

import {
  buildCouponTableRows,
  canRevokeCoupon,
  filterAndSortCouponTableRows,
  paginateCouponTableRows,
  summarizeCoupons,
  type CouponTableSortKey,
} from "../lib/coupon-operations";

type CouponOperationsWorkbenchProps = {
  auditEvents: AuditEvent[];
  coupons: Coupon[];
  customers: Customer[];
};

type CouponFormState = {
  assignedCustomerId: string;
  code: string;
  discountType: Coupon["discountType"];
  discountValue: string;
  expiresAt: string;
  status: Extract<Coupon["status"], "active" | "scheduled">;
  title: string;
};

const initialFormState: CouponFormState = {
  assignedCustomerId: "",
  code: "",
  discountType: "percent",
  discountValue: "",
  expiresAt: "2026-05-31",
  status: "active",
  title: "",
};

export function CouponOperationsWorkbench({
  auditEvents,
  coupons,
  customers,
}: CouponOperationsWorkbenchProps) {
  const [localCoupons, setLocalCoupons] = useState(coupons);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Coupon["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<CouponTableSortKey>("expires_at");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCouponId, setSelectedCouponId] = useState(coupons[0]?.id ?? "");
  const [formState, setFormState] = useState<CouponFormState>(initialFormState);
  const [pendingRevokeId, setPendingRevokeId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [activityItems, setActivityItems] = useState(() =>
    mapAuditEventsToActivityItems(
      auditEvents.filter((event) => event.entityType === "coupon"),
    ),
  );

  const rows = useMemo(
    () => buildCouponTableRows({ coupons: localCoupons, customers }),
    [customers, localCoupons],
  );
  const filteredRows = useMemo(
    () =>
      filterAndSortCouponTableRows(rows, {
        query,
        sortBy,
        status: statusFilter,
      }),
    [query, rows, sortBy, statusFilter],
  );
  const paginated = useMemo(
    () => paginateCouponTableRows(filteredRows, currentPage, 2),
    [currentPage, filteredRows],
  );
  const summary = useMemo(() => summarizeCoupons(localCoupons), [localCoupons]);

  const selectedRow =
    rows.find((row) => row.coupon.id === selectedCouponId) ??
    paginated.pageRows[0] ??
    rows[0] ??
    null;

  function resetSelection(nextCoupons: Coupon[]) {
    const fallbackId = nextCoupons[0]?.id ?? "";

    setSelectedCouponId((current) =>
      nextCoupons.some((coupon) => coupon.id === current) ? current : fallbackId,
    );
  }

  function handleIssueCoupon() {
    const trimmedTitle = formState.title.trim();
    const trimmedCode = formState.code.trim().toUpperCase();
    const numericDiscountValue = Number(formState.discountValue);

    if (
      !trimmedTitle ||
      !trimmedCode ||
      !formState.assignedCustomerId ||
      !formState.expiresAt ||
      Number.isNaN(numericDiscountValue) ||
      numericDiscountValue <= 0
    ) {
      setFormError("필수 정보를 모두 입력하고 할인 값은 0보다 크게 설정해 주세요.");
      return;
    }

    if (localCoupons.some((coupon) => coupon.code === trimmedCode)) {
      setFormError("이미 사용 중인 쿠폰 코드입니다. 다른 코드를 입력해 주세요.");
      return;
    }

    const createdCoupon: Coupon = {
      id: `coupon_${String(localCoupons.length + 1).padStart(3, "0")}`,
      assignedCustomerId: formState.assignedCustomerId,
      code: trimmedCode,
      discountType: formState.discountType,
      discountValue: numericDiscountValue,
      expiresAt: formState.expiresAt,
      status: formState.status,
      title: trimmedTitle,
    };
    const customer = customers.find(
      (item) => item.id === createdCoupon.assignedCustomerId,
    );
    const nextCoupons = [createdCoupon, ...localCoupons];
    const now = new Date().toISOString();

    setLocalCoupons(nextCoupons);
    resetSelection(nextCoupons);
    setSelectedCouponId(createdCoupon.id);
    setCurrentPage(1);
    setFormState(initialFormState);
    setFormError(null);
    setFeedbackMessage(`${trimmedCode} 쿠폰을 ${customer?.name ?? "고객"} 계정에 발급했습니다.`);
    setActivityItems((current) => [
      {
        id: `coupon-issue-${createdCoupon.id}`,
        occurredAt: now,
        summary: `${trimmedCode} 쿠폰을 발급했습니다.`,
        detail: `${customer?.name ?? "고객"} / ${trimmedTitle} / ${createdCoupon.status}`,
      },
      ...current,
    ]);
  }

  function handleConfirmRevoke() {
    if (!selectedRow || !canRevokeCoupon(selectedRow.coupon.status)) {
      return;
    }

    const nextCoupons: Coupon[] = localCoupons.map((coupon) =>
      coupon.id === selectedRow.coupon.id ? { ...coupon, status: "revoked" } : coupon,
    );
    const now = new Date().toISOString();

    setLocalCoupons(nextCoupons);
    resetSelection(nextCoupons);
    setPendingRevokeId(null);
    setFeedbackMessage(`${selectedRow.coupon.code} 쿠폰을 회수했습니다.`);
    setActivityItems((current) => [
      {
        id: `coupon-revoke-${selectedRow.coupon.id}`,
        occurredAt: now,
        summary: `${selectedRow.coupon.code} 쿠폰을 회수했습니다.`,
        detail: `${selectedRow.customer?.name ?? "고객"} / ${selectedRow.coupon.title}`,
      },
      ...current,
    ]);
  }

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="쿠폰 운영 워크벤치"
        description="보상, 할인, 리텐션 쿠폰을 발급하고 회수하며 고객별 연결 상태를 추적합니다."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="활성 쿠폰"
          value={summary.activeCount}
          description="즉시 적용 가능한 활성 쿠폰 수입니다."
        />
        <StatCard
          label="예약 쿠폰"
          value={summary.scheduledCount}
          description="고객에게 배정되었지만 아직 예약 상태인 쿠폰 수입니다."
        />
        <StatCard
          label="회수 쿠폰"
          value={summary.revokedCount}
          description="운영자가 회수 처리한 쿠폰 수입니다."
        />
        <StatCard
          label="30일 내 만료"
          value={summary.expiringSoonCount}
          description="곧 만료되는 쿠폰을 미리 확인해 대응할 수 있습니다."
        />
      </section>

      {feedbackMessage ? <ActionFeedbackBanner message={feedbackMessage} /> : null}

      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-950">
          쿠폰 검색
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-500"
            placeholder="코드, 제목, 고객명으로 검색"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-950">
          상태 필터
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as Coupon["status"] | "all");
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-500"
          >
            <option value="all">전체</option>
            <option value="active">활성</option>
            <option value="scheduled">예약</option>
            <option value="revoked">회수</option>
            <option value="expired">만료</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-950">
          정렬 기준
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as CouponTableSortKey)}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-500"
          >
            <option value="expires_at">만료일</option>
            <option value="code">쿠폰 코드</option>
            <option value="customer_name">고객명</option>
            <option value="status">상태</option>
          </select>
        </label>
        <div className="flex items-end justify-end">
          <p className="text-sm text-slate-600">
            {paginated.currentPage} / {paginated.totalPages} 페이지
          </p>
        </div>
      </section>

      <TableShell
        title="쿠폰 목록"
        description="고객 연결 상태와 만료일을 기준으로 쿠폰을 운영하고 필요한 경우 회수할 수 있습니다."
        columns={["코드", "제목", "고객", "상태", "혜택", "만료일", "작업"]}
      >
        {paginated.pageRows.length > 0 ? (
          paginated.pageRows.map((row) => (
            <tr key={row.coupon.id} className="border-t border-slate-200">
              <td className="px-6 py-4 text-sm font-medium text-slate-950">
                {row.coupon.code}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{row.coupon.title}</td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {row.customer ? (
                  <Link
                    href={`/admin/customers/${row.customer.id}`}
                    className="font-medium text-slate-950 transition hover:text-slate-700 hover:underline"
                  >
                    {row.customer.name}
                  </Link>
                ) : (
                  "고객 미지정"
                )}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <StatusBadge
                  label={couponStatusMeta[row.coupon.status].label}
                  tone={couponStatusMeta[row.coupon.status].tone}
                />
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{row.discountLabel}</td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDate(row.coupon.expiresAt)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCouponId(row.coupon.id);
                    setPendingRevokeId(null);
                  }}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  검토하기
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr className="border-t border-slate-200">
            <td className="px-6 py-8" colSpan={7}>
              <EmptyState
                title="조건에 맞는 쿠폰이 없습니다"
                description="검색어나 필터를 조정하면 다른 쿠폰을 확인할 수 있습니다."
              />
            </td>
          </tr>
        )}
      </TableShell>

      <section className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          이전
        </button>
        {Array.from({ length: paginated.totalPages }).map((_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                page === paginated.currentPage
                  ? "bg-slate-950 text-white"
                  : "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() =>
            setCurrentPage((page) => Math.min(paginated.totalPages, page + 1))
          }
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          다음
        </button>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            신규 쿠폰 발급
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-950 sm:col-span-2">
              쿠폰 제목
              <input
                value={formState.title}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, title: event.target.value }))
                }
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-500"
                placeholder="예: 결제 실패 보상 10%"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-950">
              쿠폰 코드
              <input
                value={formState.code}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, code: event.target.value }))
                }
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-normal uppercase text-slate-900 outline-none transition focus:border-slate-500"
                placeholder="SPRING-15"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-950">
              대상 고객
              <select
                value={formState.assignedCustomerId}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    assignedCustomerId: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-500"
              >
                <option value="">고객 선택</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-950">
              할인 유형
              <select
                value={formState.discountType}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    discountType: event.target.value as Coupon["discountType"],
                  }))
                }
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-500"
              >
                <option value="percent">퍼센트</option>
                <option value="fixed">정액</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-950">
              할인 값
              <input
                value={formState.discountValue}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    discountValue: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-500"
                inputMode="numeric"
                placeholder={formState.discountType === "percent" ? "15" : "10000"}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-950">
              발급 상태
              <select
                value={formState.status}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    status: event.target.value as CouponFormState["status"],
                  }))
                }
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-500"
              >
                <option value="active">활성</option>
                <option value="scheduled">예약</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-950 sm:col-span-2">
              만료일
              <input
                type="date"
                value={formState.expiresAt}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    expiresAt: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-500"
              />
            </label>
          </div>

          {formError ? (
            <p className="mt-4 text-sm font-medium text-rose-600">{formError}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleIssueCoupon}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              쿠폰 발급
            </button>
            <button
              type="button"
              onClick={() => {
                setFormState(initialFormState);
                setFormError(null);
              }}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              입력 초기화
            </button>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            쿠폰 검토 및 회수
          </p>

          {selectedRow ? (
            <>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                {selectedRow.coupon.code}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{selectedRow.coupon.title}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <StatusBadge
                  label={couponStatusMeta[selectedRow.coupon.status].label}
                  tone={couponStatusMeta[selectedRow.coupon.status].tone}
                />
                <StatusBadge label={selectedRow.discountLabel} tone="info" />
              </div>

              <dl className="mt-8 space-y-4 text-sm leading-6 text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-950">대상 고객</dt>
                  <dd className="mt-1">
                    {selectedRow.customer ? (
                      <Link
                        href={`/admin/customers/${selectedRow.customer.id}`}
                        className="font-medium text-slate-950 transition hover:text-slate-700 hover:underline"
                      >
                        {selectedRow.customer.name}
                      </Link>
                    ) : (
                      "고객 미지정"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">만료일</dt>
                  <dd className="mt-1">{formatDate(selectedRow.coupon.expiresAt)}</dd>
                </div>
              </dl>

              {canRevokeCoupon(selectedRow.coupon.status) ? (
                <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-sm font-semibold text-rose-700">회수 확인</p>
                  <p className="mt-2 text-sm leading-6 text-rose-700">
                    회수하면 고객 계정에서 이 쿠폰을 더 이상 사용할 수 없습니다.
                  </p>
                  {pendingRevokeId === selectedRow.coupon.id ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleConfirmRevoke}
                        className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
                      >
                        회수 확인
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingRevokeId(null)}
                        className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingRevokeId(selectedRow.coupon.id)}
                      className="mt-4 rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      회수 준비
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-8">
                  <EmptyState
                    title="회수 대상이 아닙니다"
                    description="이미 회수되었거나 만료된 쿠폰은 현재 상태만 확인할 수 있습니다."
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="검토할 쿠폰이 없습니다"
              description="목록에서 쿠폰을 선택하면 여기에서 상태를 검토하고 회수할 수 있습니다."
            />
          )}
        </article>
      </section>

      <ActionActivityFeed
        title="쿠폰 처리 로그"
        description="기존 감사 이벤트와 이번 세션의 발급 및 회수 이력을 함께 확인합니다."
        emptyTitle="아직 쿠폰 처리 이력이 없습니다"
        emptyDescription="쿠폰을 발급하거나 회수하면 최근 처리 이력이 여기에 추가됩니다."
        items={activityItems}
      />
    </main>
  );
}
