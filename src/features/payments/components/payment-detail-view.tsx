import Link from "next/link";

import { AdminRouteHeader } from "@/components/shared/admin-route-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { getAdminSubscriptionsHref } from "@/lib/admin-routes";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

import {
  paymentStatusMeta,
  refundStatusMeta,
  subscriptionStatusMeta,
} from "../lib/payment-detail";
import type { PaymentDetailSnapshot } from "../lib/payment-detail";

type PaymentDetailViewProps = {
  snapshot: PaymentDetailSnapshot;
};

export function PaymentDetailView({ snapshot }: PaymentDetailViewProps) {
  const { activityItems, customer, invoice, payment, refunds, stats, subscription } =
    snapshot;
  const quickLinks = [
    {
      label: "결제 목록",
      description: "최근 결제와 실패 결제 목록으로 돌아갑니다.",
      href: "/admin/payments",
    },
    ...(customer
      ? [
          {
            label: "고객 상세",
            description: "결제가 발생한 고객 계정 흐름을 이어서 확인합니다.",
            href: `/admin/customers/${customer.id}`,
          },
        ]
      : []),
    ...(refunds[0]
      ? [
          {
            label: "관련 환불",
            description: "이 결제와 연결된 가장 최근 환불 요청을 엽니다.",
            href: `/admin/refunds/${refunds[0].id}`,
          },
        ]
      : []),
    ...(subscription
      ? [
          {
            label: "구독 워크벤치",
            description: "관련 구독을 초점 상태로 열어 상태 전환을 검토합니다.",
            href: getAdminSubscriptionsHref(subscription.id),
          },
        ]
      : []),
  ];

  return (
    <main className="flex flex-col gap-10">
      <AdminRouteHeader
        breadcrumbs={[
          { label: "관리자 홈", href: "/admin" },
          { label: "결제", href: "/admin/payments" },
          { label: payment.id },
        ]}
        eyebrow="결제 상세"
        title={`${payment.id} 결제 추적`}
        description="결제 상태, 청구 맥락, 고객 정보, 연결 환불, 감사 이벤트를 한 화면에서 확인합니다."
        quickLinks={quickLinks}
      />

      <section>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            결제 요약
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {stats.amount}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {payment.methodLabel}로 {formatDateTime(payment.attemptedAt)}에 결제를
            시도했습니다.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <StatusBadge
              label={paymentStatusMeta[payment.status].label}
              tone={paymentStatusMeta[payment.status].tone}
            />
            <StatusBadge label={stats.reviewedState} tone="info" />
            {invoice ? (
              <StatusBadge label={`청구서 ${invoice.number}`} tone="neutral" />
            ) : null}
          </div>

          <dl className="mt-8 grid gap-4 text-sm leading-6 text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-950">결제 수단</dt>
              <dd className="mt-1">{payment.methodLabel}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">결제 시도 시점</dt>
              <dd className="mt-1">{formatDateTime(payment.attemptedAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">연결 청구서</dt>
              <dd className="mt-1">{invoice?.number ?? "청구서 정보 없음"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">환불 합계</dt>
              <dd className="mt-1">{stats.refundTotal}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="결제 상태"
          value={paymentStatusMeta[payment.status].label}
          description="현재 결제 건의 처리 상태입니다."
        />
        <StatCard
          label="결제 금액"
          value={stats.amount}
          description="이번 결제 시도에 청구된 금액입니다."
        />
        <StatCard
          label="연결 환불"
          value={stats.relatedRefundCount}
          description="이 결제와 직접 연결된 환불 건수입니다."
        />
        <StatCard
          label="관련 고객"
          value={customer?.name ?? "미확인"}
          description="해당 결제 건을 발생시킨 고객 계정입니다."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            고객 및 청구 문맥
          </p>

          <dl className="mt-6 grid gap-4 text-sm leading-6 text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-950">고객</dt>
              <dd className="mt-1">
                {customer ? `${customer.name} / ${customer.email}` : "고객 정보 미확인"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">회사</dt>
              <dd className="mt-1">{customer?.company ?? "회사 정보 없음"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">구독 상태</dt>
              <dd className="mt-1">
                {subscription ? (
                  <StatusBadge
                    label={subscriptionStatusMeta[subscription.status].label}
                    tone={subscriptionStatusMeta[subscription.status].tone}
                  />
                ) : (
                  "구독 정보 미확인"
                )}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">플랜</dt>
              <dd className="mt-1">{subscription?.plan?.name ?? "플랜 정보 없음"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">청구서 발행일</dt>
              <dd className="mt-1">
                {invoice ? formatDate(invoice.issuedAt) : "청구 정보 없음"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">청구서 만기일</dt>
              <dd className="mt-1">
                {invoice ? formatDate(invoice.dueAt) : "청구 정보 없음"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">다음 청구일</dt>
              <dd className="mt-1">
                {subscription?.nextBillingDate
                  ? formatDate(subscription.nextBillingDate)
                  : "예정 없음"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">고객 가입일</dt>
              <dd className="mt-1">
                {customer ? formatDate(customer.joinedAt) : "고객 정보 미확인"}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            감사 타임라인
          </p>

          {activityItems.length > 0 ? (
            <ol className="mt-6 space-y-4">
              {activityItems.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-slate-950">
                    {item.summary}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{item.actorLabel}</p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    {formatDateTime(item.occurredAt)}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="감사 이벤트가 없습니다"
                description="이 결제 또는 연결 환불과 관련된 운영 이벤트가 기록되면 여기에서 확인할 수 있습니다."
              />
            </div>
          )}
        </article>
      </section>

      <TableShell
        title="연결 환불"
        description="이 결제 건에 연결된 환불 요청과 처리 상태를 확인합니다."
        columns={["환불 ID", "상태", "금액", "요청일", "이동"]}
      >
        {refunds.length > 0 ? (
          refunds.map((refund) => (
            <tr key={refund.id} className="border-t border-slate-200">
              <td className="px-6 py-4 text-sm font-medium text-slate-950">
                {refund.id}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <StatusBadge
                  label={refundStatusMeta[refund.status].label}
                  tone={refundStatusMeta[refund.status].tone}
                />
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatCurrency(refund.amount)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDate(refund.requestedAt)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <Link
                  href={`/admin/refunds/${refund.id}`}
                  className="font-medium text-slate-950 transition hover:text-slate-700 hover:underline"
                >
                  상세 보기
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <tr className="border-t border-slate-200">
            <td className="px-6 py-8" colSpan={5}>
              <EmptyState
                title="연결된 환불이 없습니다"
                description="이 결제 건에서 환불이 생성되면 여기에서 상태와 요청 시점을 확인할 수 있습니다."
              />
            </td>
          </tr>
        )}
      </TableShell>
    </main>
  );
}
