import { AdminRouteHeader } from "@/components/shared/admin-route-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminSubscriptionsHref } from "@/lib/admin-routes";
import { formatDate, formatDateTime } from "@/lib/format";

import { refundStatusMeta, subscriptionStatusMeta } from "../lib/refund-detail";
import type { RefundDetailSnapshot } from "../lib/refund-detail";

type RefundDetailViewProps = {
  snapshot: RefundDetailSnapshot;
};

export function RefundDetailView({ snapshot }: RefundDetailViewProps) {
  const { activityItems, customer, payment, refund, stats, subscription } = snapshot;
  const quickLinks = [
    {
      label: "환불 목록",
      description: "환불 검토 보드와 최근 처리 목록으로 돌아갑니다.",
      href: "/admin/refunds",
    },
    ...(payment
      ? [
          {
            label: "결제 상세",
            description: "환불과 연결된 원 결제 맥락을 다시 확인합니다.",
            href: `/admin/payments/${payment.id}`,
          },
        ]
      : []),
    ...(customer
      ? [
          {
            label: "고객 상세",
            description: "고객 계정의 구독, 결제, 환불 흐름을 함께 확인합니다.",
            href: `/admin/customers/${customer.id}`,
          },
        ]
      : []),
    ...(subscription
      ? [
          {
            label: "구독 워크벤치",
            description: "관련 구독을 초점 상태로 열어 운영 판단을 이어갑니다.",
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
          { label: "환불", href: "/admin/refunds" },
          { label: refund.id },
        ]}
        eyebrow="환불 상세"
        title={`${refund.id} 환불 검토 상세`}
        description="환불 요청의 상태, 고객과 결제 맥락, 검토 메모, 감사 이벤트를 한 화면에서 확인할 수 있습니다."
        quickLinks={quickLinks}
      />

      <section>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            환불 요약
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {stats.refundAmount}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{refund.reason}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <StatusBadge
              label={refundStatusMeta[refund.status].label}
              tone={refundStatusMeta[refund.status].tone}
            />
            <StatusBadge label={stats.reviewedState} tone="info" />
            <StatusBadge
              label={`요청일 ${formatDate(refund.requestedAt)}`}
              tone="neutral"
            />
          </div>

          <dl className="mt-8 grid gap-4 text-sm leading-6 text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-950">검토 메모</dt>
              <dd className="mt-1">
                {refund.reviewComment ?? "아직 입력된 검토 메모가 없습니다."}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">검토 완료 시점</dt>
              <dd className="mt-1">
                {refund.reviewedAt ? formatDateTime(refund.reviewedAt) : "아직 처리 전"}
              </dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="환불 상태"
          value={refundStatusMeta[refund.status].label}
          description="현재 환불 요청의 검토 상태입니다."
        />
        <StatCard
          label="환불 금액"
          value={stats.refundAmount}
          description="이번 요청에서 검토 중인 환불 금액입니다."
        />
        <StatCard
          label="관련 결제"
          value={payment?.id ?? "미확인"}
          description="이 환불 요청과 연결된 원 결제 건입니다."
        />
        <StatCard
          label="관련 고객"
          value={customer?.name ?? "미확인"}
          description="환불 요청을 제출한 고객입니다."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            고객 및 결제 컨텍스트
          </p>

          <dl className="mt-6 grid gap-4 text-sm leading-6 text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-950">고객</dt>
              <dd className="mt-1">
                {customer ? `${customer.name} · ${customer.email}` : "고객 정보 미확인"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">결제 수단</dt>
              <dd className="mt-1">
                {payment?.methodLabel ?? "결제 수단 미확인"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">결제 시도 시점</dt>
              <dd className="mt-1">
                {payment ? formatDateTime(payment.attemptedAt) : "미확인"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">연결 구독 상태</dt>
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
              <dd className="mt-1">{subscription?.plan?.name ?? "플랜 미확인"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">다음 청구일</dt>
              <dd className="mt-1">
                {subscription?.nextBillingDate
                  ? formatDate(subscription.nextBillingDate)
                  : "일정 없음"}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            감사 트레일
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
                description="이 환불 요청과 관련된 운영 이벤트가 기록되면 여기에서 확인할 수 있습니다."
              />
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
