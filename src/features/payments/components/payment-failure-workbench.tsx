"use client";

import { useState } from "react";

import { ActionActivityFeed } from "@/components/shared/action-activity-feed";
import { ActionFeedbackBanner } from "@/components/shared/action-feedback-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { paymentStatusMeta } from "@/lib/domain-meta";
import { formatCurrency, formatDate } from "@/lib/format";
import { mapAuditEventsToActivityItems } from "@/lib/workflow-activity";
import type { AuditEvent, Customer, Payment } from "@/types/domain";

type PaymentFailureWorkbenchProps = {
  auditEvents: AuditEvent[];
  customers: Customer[];
  payments: Payment[];
};

type PaymentAction = "mark_pending" | "mark_paid" | "mark_failed" | null;

export function PaymentFailureWorkbench({
  auditEvents,
  customers,
  payments,
}: PaymentFailureWorkbenchProps) {
  const [localPayments, setLocalPayments] = useState(payments);
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    payments.find((payment) => payment.status === "failed")?.id ??
      payments[0]?.id ??
      "",
  );
  const [pendingAction, setPendingAction] = useState<PaymentAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [activityItems, setActivityItems] = useState(() =>
    mapAuditEventsToActivityItems(
      auditEvents.filter((event) => event.entityType === "payment"),
    ),
  );

  const rows = localPayments
    .toSorted((a, b) => b.attemptedAt.localeCompare(a.attemptedAt))
    .map((payment) => ({
      customer: customers.find((item) => item.id === payment.customerId),
      payment,
    }));

  const selectedRow =
    rows.find((row) => row.payment.id === selectedPaymentId) ?? rows[0] ?? null;

  const paidCount = localPayments.filter((payment) => payment.status === "paid").length;
  const failedCount = localPayments.filter((payment) => payment.status === "failed").length;
  const pendingCount = localPayments.filter(
    (payment) => payment.status === "pending",
  ).length;

  const unresolvedRows = rows.filter(
    (row) => row.payment.status === "failed" || row.payment.status === "pending",
  );

  function handleConfirmAction() {
    if (!selectedRow || !pendingAction) {
      return;
    }

    const now = new Date().toISOString();
    const targetStatus =
      pendingAction === "mark_pending"
        ? "pending"
        : pendingAction === "mark_paid"
          ? "paid"
          : "failed";
    const summary = `${selectedRow.payment.id} 결제 건을 ${
      paymentStatusMeta[targetStatus].label
    } 상태로 업데이트했습니다.`;

    setLocalPayments((current) =>
      current.map((payment) =>
        payment.id === selectedRow.payment.id
          ? { ...payment, status: targetStatus }
          : payment,
      ),
    );

    setFeedbackMessage(summary);
    setActivityItems((current) => [
      {
        id: `payment-${selectedRow.payment.id}-${now}`,
        occurredAt: now,
        summary,
        detail: `payment · ${selectedRow.payment.id} · ${selectedRow.customer?.name ?? "고객 미확인"}`,
      },
      ...current,
    ]);
    setPendingAction(null);
  }

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="결제 실패 대응"
        description="실패 결제에 대해 재시도 예정 처리, 수동 결제 완료, 상태 복구를 안전하게 진행할 수 있는 운영 워크플로우입니다."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="정상 결제"
          value={`${paidCount}건`}
          description="정상적으로 처리된 결제 건수입니다."
        />
        <StatCard
          label="실패 결제"
          value={`${failedCount}건`}
          description="즉시 대응이 필요한 실패 건수입니다."
        />
        <StatCard
          label="재시도 예정"
          value={`${pendingCount}건`}
          description="운영자가 후속 처리를 잡아둔 결제 건수입니다."
        />
      </section>

      {feedbackMessage ? <ActionFeedbackBanner message={feedbackMessage} /> : null}

      <TableShell
        title="우선 대응 결제"
        description="실패 또는 재시도 예정 상태의 결제를 먼저 정렬해 운영자가 바로 액션을 취할 수 있도록 구성했습니다."
        columns={["결제 ID", "고객", "상태", "금액", "시도 시점", "작업"]}
      >
        {unresolvedRows.map((row) => {
          const statusMeta = paymentStatusMeta[row.payment.status];

          return (
            <tr key={row.payment.id} className="border-t border-slate-200">
              <td className="px-6 py-4 text-sm font-medium text-slate-950">
                {row.payment.id}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {row.customer?.name ?? "고객 미확인"}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatCurrency(row.payment.amount)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDate(row.payment.attemptedAt)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaymentId(row.payment.id);
                    setPendingAction(null);
                  }}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  대응하기
                </button>
              </td>
            </tr>
          );
        })}
      </TableShell>

      {unresolvedRows.length === 0 ? (
        <EmptyState
          title="현재 대응이 필요한 결제가 없습니다"
          description="실패 결제가 다시 발생하면 이 화면에서 운영 액션을 진행할 수 있습니다."
        />
      ) : selectedRow ? (
        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              선택된 결제
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {selectedRow.payment.id}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {selectedRow.customer?.name ?? "고객 미확인"} ·{" "}
              {selectedRow.payment.methodLabel}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <StatusBadge
                label={paymentStatusMeta[selectedRow.payment.status].label}
                tone={paymentStatusMeta[selectedRow.payment.status].tone}
              />
              <StatusBadge
                label={formatCurrency(selectedRow.payment.amount)}
                tone="info"
              />
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => setPendingAction("mark_pending")}
                className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                  pendingAction === "mark_pending"
                    ? "border-slate-900 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-semibold">재시도 예정으로 변경</p>
                <p className="mt-2 text-sm leading-6 text-inherit">
                  고객 후속 안내를 완료했고 재시도 일정이 잡힌 상태로 표시합니다.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setPendingAction("mark_paid")}
                className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                  pendingAction === "mark_paid"
                    ? "border-slate-900 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-semibold">수동 결제 완료 처리</p>
                <p className="mt-2 text-sm leading-6 text-inherit">
                  운영자가 별도 채널에서 결제를 확인한 뒤 정상 완료로 처리합니다.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setPendingAction("mark_failed")}
                className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                  pendingAction === "mark_failed"
                    ? "border-slate-900 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-semibold">실패 상태 유지</p>
                <p className="mt-2 text-sm leading-6 text-inherit">
                  고객 응답이 없거나 추가 확인이 필요해 실패 상태를 유지합니다.
                </p>
              </button>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              처리 확인
            </p>

            {pendingAction ? (
              <>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                  {pendingAction === "mark_pending"
                    ? "재시도 일정 등록"
                    : pendingAction === "mark_paid"
                      ? "수동 결제 완료 처리"
                      : "실패 상태 유지"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  실제 외부 결제를 호출하지는 않지만, 운영 제품처럼 확인 후 상태를
                  갱신하고 테이블과 상단 요약 카드에 즉시 반영합니다.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmAction}
                    className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    처리 확인
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingAction(null)}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                왼쪽에서 대응 액션을 선택하면 이 영역에서 확인 후 처리할 수
                있습니다.
              </p>
            )}
          </article>
        </section>
      ) : null}

      <ActionActivityFeed
        title="결제 대응 로그"
        description="우선 대응 목록의 기존 감사 이벤트와 이번 세션에서 처리한 결제 액션을 함께 확인할 수 있습니다."
        emptyTitle="아직 기록된 결제 대응 이력이 없습니다"
        emptyDescription="실패 결제에 액션을 적용하면 최근 처리 이력이 이곳에 추가됩니다."
        items={activityItems}
      />
    </main>
  );
}
