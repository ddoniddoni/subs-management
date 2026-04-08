"use client";

import { useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { refundStatusMeta } from "@/lib/domain-meta";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Customer, Payment, Refund } from "@/types/domain";

type RefundReviewBoardProps = {
  customers: Customer[];
  payments: Payment[];
  refunds: Refund[];
};

type RefundDecision = "approved" | "rejected" | null;

export function RefundReviewBoard({
  customers,
  payments,
  refunds,
}: RefundReviewBoardProps) {
  const [localRefunds, setLocalRefunds] = useState(refunds);
  const [selectedRefundId, setSelectedRefundId] = useState(
    refunds.find((refund) => refund.status === "requested")?.id ??
      refunds[0]?.id ??
      "",
  );
  const [decision, setDecision] = useState<RefundDecision>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const rows = localRefunds
    .toSorted((a, b) => b.requestedAt.localeCompare(a.requestedAt))
    .map((refund) => ({
      customer: customers.find((item) => item.id === refund.customerId),
      payment: payments.find((item) => item.id === refund.paymentId),
      refund,
    }));

  const selectedRow =
    rows.find((row) => row.refund.id === selectedRefundId) ?? rows[0] ?? null;

  const requestedCount = localRefunds.filter(
    (refund) => refund.status === "requested",
  ).length;
  const approvedCount = localRefunds.filter(
    (refund) => refund.status === "approved",
  ).length;
  const rejectedCount = localRefunds.filter(
    (refund) => refund.status === "rejected",
  ).length;

  function handleConfirmDecision() {
    if (!selectedRow || !decision) {
      return;
    }

    const effectiveComment =
      reviewComment.trim() ||
      (decision === "approved"
        ? "환불 기준을 충족해 승인했습니다."
        : "환불 기준 미충족으로 반려했습니다.");

    setLocalRefunds((current) =>
      current.map((refund) =>
        refund.id === selectedRow.refund.id
          ? {
              ...refund,
              status: decision,
              reviewedAt: new Date().toISOString(),
              reviewComment: effectiveComment,
            }
          : refund,
      ),
    );

    setFeedbackMessage(
      `${selectedRow.customer?.name ?? "고객"}의 환불 요청을 ${
        decision === "approved" ? "승인" : "반려"
      }했습니다.`,
    );
    setDecision(null);
    setReviewComment("");
  }

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="환불 검토 워크플로우"
        description="환불 요청을 검토하고 승인 또는 반려를 결정하는 운영 흐름입니다. 확인 단계와 처리 결과를 함께 보여주도록 구성했습니다."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="검토 대기"
          value={`${requestedCount}건`}
          description="아직 의사결정이 내려지지 않은 환불 요청입니다."
        />
        <StatCard
          label="승인 완료"
          value={`${approvedCount}건`}
          description="운영 검토를 거쳐 승인된 환불 건수입니다."
        />
        <StatCard
          label="반려"
          value={`${rejectedCount}건`}
          description="사유와 함께 반려 처리된 환불 건수입니다."
        />
      </section>

      {feedbackMessage ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-700">처리 완료</p>
          <p className="mt-2 text-sm leading-6 text-emerald-700">
            {feedbackMessage}
          </p>
        </section>
      ) : null}

      <TableShell
        title="환불 요청 목록"
        description="검토 대기 건을 선택하면 아래에서 승인 또는 반려를 진행할 수 있습니다."
        columns={["요청 ID", "고객", "상태", "금액", "요청일", "작업"]}
      >
        {rows.map((row) => {
          const statusMeta = refundStatusMeta[row.refund.status];

          return (
            <tr key={row.refund.id} className="border-t border-slate-200">
              <td className="px-6 py-4 text-sm font-medium text-slate-950">
                {row.refund.id}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {row.customer?.name ?? "고객 미확인"}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatCurrency(row.refund.amount)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDate(row.refund.requestedAt)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRefundId(row.refund.id);
                    setDecision(null);
                    setReviewComment(row.refund.reviewComment ?? "");
                  }}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  검토 열기
                </button>
              </td>
            </tr>
          );
        })}
      </TableShell>

      {selectedRow ? (
        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              요청 상세
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {selectedRow.customer?.name ?? "고객 미확인"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              결제 ID {selectedRow.payment?.id ?? "미확인"} ·{" "}
              {selectedRow.payment?.methodLabel ?? "결제 수단 미확인"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <StatusBadge
                label={refundStatusMeta[selectedRow.refund.status].label}
                tone={refundStatusMeta[selectedRow.refund.status].tone}
              />
              <StatusBadge
                label={formatCurrency(selectedRow.refund.amount)}
                tone="info"
              />
            </div>

            <dl className="mt-8 space-y-4 text-sm leading-6 text-slate-600">
              <div>
                <dt className="font-semibold text-slate-950">요청 사유</dt>
                <dd className="mt-1">{selectedRow.refund.reason}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">검토 메모</dt>
                <dd className="mt-1">
                  {selectedRow.refund.reviewComment ?? "아직 남긴 메모가 없습니다."}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              검토 액션
            </p>

            {selectedRow.refund.status === "requested" ? (
              <>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setDecision("approved")}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                      decision === "approved"
                        ? "bg-emerald-600 text-white"
                        : "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    승인 준비
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision("rejected")}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                      decision === "rejected"
                        ? "bg-rose-600 text-white"
                        : "border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    }`}
                  >
                    반려 준비
                  </button>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="refund-review-comment"
                    className="text-sm font-semibold text-slate-950"
                  >
                    검토 메모
                  </label>
                  <textarea
                    id="refund-review-comment"
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    rows={4}
                    className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                    placeholder="승인 기준이나 반려 사유를 남겨두세요."
                  />
                </div>

                {decision ? (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {decision === "approved" ? "승인" : "반려"} 확인
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      처리 후 상태가 즉시 업데이트되며, 검토 메모도 함께 저장됩니다.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleConfirmDecision}
                        className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        처리 확인
                      </button>
                      <button
                        type="button"
                        onClick={() => setDecision(null)}
                        className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <EmptyState
                title="이미 처리된 환불 요청입니다"
                description="이 요청은 검토가 완료되어 현재 상태만 확인할 수 있습니다. 다른 요청을 선택하면 추가 검토를 진행할 수 있습니다."
              />
            )}
          </article>
        </section>
      ) : null}
    </main>
  );
}
