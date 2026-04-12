import Link from "next/link";

import { AdminRouteHeader } from "@/components/shared/admin-route-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { getAdminSubscriptionsHref } from "@/lib/admin-routes";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

import {
  couponStatusMeta,
  paymentStatusMeta,
  refundStatusMeta,
  subscriptionStatusMeta,
} from "../lib/customer-detail";
import type { CustomerDetailSnapshot } from "../lib/customer-detail";

type CustomerDetailViewProps = {
  snapshot: CustomerDetailSnapshot;
};

export function CustomerDetailView({ snapshot }: CustomerDetailViewProps) {
  const { activityItems, coupons, customer, payments, refunds, stats, subscription } =
    snapshot;
  const latestPayment = payments[0] ?? null;
  const latestRefund = refunds[0] ?? null;
  const quickLinks = [
    {
      label: "고객 목록",
      description: "고객 탐색 테이블로 돌아가 다른 계정을 확인합니다.",
      href: "/admin/customers",
    },
    ...(subscription
      ? [
          {
            label: "구독 워크벤치",
            description: "현재 고객의 구독을 초점 상태로 바로 엽니다.",
            href: getAdminSubscriptionsHref(subscription.id),
          },
        ]
      : []),
    {
      label: latestPayment ? "최근 결제 상세" : "결제 작업대",
      description: latestPayment
        ? "가장 최근 결제 건의 상세 맥락으로 이동합니다."
        : "해당 고객의 결제 흐름을 목록에서 다시 확인합니다.",
      href: latestPayment ? `/admin/payments/${latestPayment.id}` : "/admin/payments",
    },
    {
      label: latestRefund ? "최근 환불 상세" : "환불 검토 보드",
      description: latestRefund
        ? "가장 최근 환불 요청의 검토 상태를 확인합니다."
        : "관련 환불 요청이 생기면 보드에서 검토합니다.",
      href: latestRefund ? `/admin/refunds/${latestRefund.id}` : "/admin/refunds",
    },
  ];

  return (
    <main className="flex flex-col gap-10">
      <AdminRouteHeader
        breadcrumbs={[
          { label: "관리자 홈", href: "/admin" },
          { label: "고객", href: "/admin/customers" },
          { label: customer.name },
        ]}
        eyebrow="고객 상세"
        title={`${customer.name} 운영 상세`}
        description={`${customer.company} 계정의 구독 상태, 결제 이력, 환불 처리, 쿠폰 보상, 감사 이벤트를 한 화면에서 확인할 수 있습니다.`}
        quickLinks={quickLinks}
      />

      <section>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            고객 프로필
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {customer.name}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{customer.email}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <StatusBadge label={customer.segment} tone="info" />
            <StatusBadge
              label={`가입일 ${formatDate(customer.joinedAt)}`}
              tone="neutral"
            />
            {subscription ? (
              <StatusBadge
                label={subscriptionStatusMeta[subscription.status].label}
                tone={subscriptionStatusMeta[subscription.status].tone}
              />
            ) : null}
          </div>

          <dl className="mt-8 grid gap-4 text-sm leading-6 text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-950">회사</dt>
              <dd className="mt-1">{customer.company}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">현재 플랜</dt>
              <dd className="mt-1">{subscription?.plan?.name ?? "구독 정보 없음"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">좌석 수</dt>
              <dd className="mt-1">
                {subscription ? `${subscription.seats}석 사용 중` : "미확인"}
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
          </dl>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="누적 결제액"
          value={stats.totalPayments}
          description="완료 또는 환불 처리 전 결제 금액 기준 누적 합계입니다."
        />
        <StatCard
          label="누적 환불액"
          value={stats.refundAmount}
          description="운영 검토를 거쳐 환불로 처리된 누적 금액입니다."
        />
        <StatCard
          label="미해결 결제"
          value={stats.unresolvedPaymentCount}
          description="실패 또는 재시도 예정으로 남아 있는 후속 대응 건수입니다."
        />
        <StatCard
          label="활성 쿠폰"
          value={stats.activeCouponCount}
          description="현재 고객에게 효력이 있거나 예정된 보상 쿠폰 수입니다."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            구독 요약
          </p>

          {subscription ? (
            <>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                {subscription.plan?.name ?? "플랜 미확인"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {subscription.plan?.description ??
                  "이 고객의 현재 구독에 연결된 플랜 설명이 없습니다."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <StatusBadge
                  label={subscriptionStatusMeta[subscription.status].label}
                  tone={subscriptionStatusMeta[subscription.status].tone}
                />
                <StatusBadge
                  label={`${subscription.seats}석`}
                  tone="info"
                />
                {subscription.cancelAt ? (
                  <StatusBadge
                    label={`종료 예정 ${formatDate(subscription.cancelAt)}`}
                    tone="danger"
                  />
                ) : null}
              </div>

              <dl className="mt-8 grid gap-4 text-sm leading-6 text-slate-600 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-950">시작일</dt>
                  <dd className="mt-1">{formatDate(subscription.startedAt)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">다음 청구일</dt>
                  <dd className="mt-1">
                    {subscription.nextBillingDate
                      ? formatDate(subscription.nextBillingDate)
                      : "예정 없음"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">청구 주기</dt>
                  <dd className="mt-1">
                    {subscription.plan?.billingInterval === "annual"
                      ? "연간"
                      : "월간"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">기본 포함 좌석</dt>
                  <dd className="mt-1">
                    {subscription.plan?.seatsIncluded
                      ? `${subscription.plan.seatsIncluded}석`
                      : "미확인"}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="현재 구독 정보가 없습니다"
                description="이 고객은 아직 활성 구독이 없거나 목업 데이터에 연결되지 않았습니다."
              />
            </div>
          )}
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
                description="이 고객과 관련된 운영 이벤트가 생기면 이 타임라인에서 확인할 수 있습니다."
              />
            </div>
          )}
        </article>
      </section>

      <TableShell
        title="결제 이력"
        description="최근 결제 시도와 상태를 날짜순으로 정리했습니다."
        columns={["결제 ID", "상태", "금액", "결제 수단", "시도 시점"]}
      >
        {payments.length > 0 ? (
          payments.map((payment) => (
            <tr key={payment.id} className="border-t border-slate-200">
              <td className="px-6 py-4 text-sm font-medium text-slate-950">
                <Link
                  href={`/admin/payments/${payment.id}`}
                  className="transition hover:text-slate-700 hover:underline"
                >
                  {payment.id}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <StatusBadge
                  label={paymentStatusMeta[payment.status].label}
                  tone={paymentStatusMeta[payment.status].tone}
                />
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatCurrency(payment.amount)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {payment.methodLabel}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDateTime(payment.attemptedAt)}
              </td>
            </tr>
          ))
        ) : (
          <tr className="border-t border-slate-200">
            <td className="px-6 py-8" colSpan={5}>
              <EmptyState
                title="결제 이력이 없습니다"
                description="이 고객의 결제 시도가 추가되면 이 표에 표시됩니다."
              />
            </td>
          </tr>
        )}
      </TableShell>

      <section className="grid gap-4 xl:grid-cols-2">
        <TableShell
          title="환불 이력"
          description="환불 요청과 검토 결과를 고객 기준으로 묶어서 확인합니다."
          columns={["환불 ID", "상태", "금액", "요청일"]}
        >
          {refunds.length > 0 ? (
            refunds.map((refund) => (
              <tr key={refund.id} className="border-t border-slate-200">
                <td className="px-6 py-4 text-sm font-medium text-slate-950">
                  <Link
                    href={`/admin/refunds/${refund.id}`}
                    className="transition hover:text-slate-700 hover:underline"
                  >
                    {refund.id}
                  </Link>
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
              </tr>
            ))
          ) : (
            <tr className="border-t border-slate-200">
              <td className="px-6 py-8" colSpan={4}>
                <EmptyState
                  title="환불 이력이 없습니다"
                  description="환불 요청이 접수되면 이 표에 상태와 사유가 함께 표시됩니다."
                />
              </td>
            </tr>
          )}
        </TableShell>

        <TableShell
          title="쿠폰 이력"
          description="이 고객에게 할당된 유지 보상 및 할인 쿠폰 목록입니다."
          columns={["쿠폰 코드", "상태", "혜택", "만료일"]}
        >
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <tr key={coupon.id} className="border-t border-slate-200">
                <td className="px-6 py-4 text-sm font-medium text-slate-950">
                  {coupon.code}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <StatusBadge
                    label={couponStatusMeta[coupon.status].label}
                    tone={couponStatusMeta[coupon.status].tone}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {coupon.discountType === "percent"
                    ? `${coupon.discountValue}% 할인`
                    : formatCurrency(coupon.discountValue)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatDate(coupon.expiresAt)}
                </td>
              </tr>
            ))
          ) : (
            <tr className="border-t border-slate-200">
              <td className="px-6 py-8" colSpan={4}>
                <EmptyState
                  title="할당된 쿠폰이 없습니다"
                  description="보상 쿠폰이 발급되면 이 표에서 이력과 상태를 확인할 수 있습니다."
                />
              </td>
            </tr>
          )}
        </TableShell>
      </section>
    </main>
  );
}
