import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { subscriptionStatusMeta } from "@/lib/domain-meta";
import {
  coupons,
  currentCustomerId,
  customers,
  plans,
  subscriptions,
} from "@/mocks/subscription-data";

export default function SubscriptionPage() {
  const customer = customers.find((item) => item.id === currentCustomerId);
  const subscription = subscriptions.find(
    (item) => item.customerId === currentCustomerId,
  );

  if (!customer || !subscription) {
    return null;
  }

  const plan = plans.find((item) => item.id === subscription.planId);
  const activeCoupon = coupons.find(
    (item) =>
      item.assignedCustomerId === currentCustomerId && item.status === "active",
  );
  const statusMeta = subscriptionStatusMeta[subscription.status];

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="고객 계정"
        title="내 구독"
        description={`${customer.name} 고객의 현재 구독 상태와 다음 청구 일정을 실제 목업 데이터 기반으로 보여주는 화면입니다.`}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
          {plan ? (
            <StatusBadge
              label={`${plan.billingInterval === "monthly" ? "월간" : "연간"} 플랜`}
              tone="info"
            />
          ) : null}
          {activeCoupon ? (
            <StatusBadge label={`${activeCoupon.code} 적용 중`} tone="warning" />
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard
            label="현재 플랜"
            value={plan?.name ?? "미확인 플랜"}
            description={plan?.description ?? "플랜 정보가 아직 연결되지 않았습니다."}
          />
          <StatCard
            label="다음 결제일"
            value={
              subscription.nextBillingDate
                ? formatDate(subscription.nextBillingDate)
                : "청구 일정 없음"
            }
            description={`${subscription.seats}석 사용 중이며 가입 시작일은 ${formatDate(subscription.startedAt)}입니다.`}
          />
          <StatCard
            label="적용 혜택"
            value={activeCoupon ? activeCoupon.title : "적용 쿠폰 없음"}
            description={
              activeCoupon
                ? `${activeCoupon.expiresAt}까지 ${
                    activeCoupon.discountType === "percent"
                      ? `${activeCoupon.discountValue}%`
                      : `${activeCoupon.discountValue.toLocaleString("ko-KR")}원`
                  } 할인 적용`
                : `${customer.company} 계정에는 현재 적용 중인 쿠폰이 없습니다.`
            }
          />
        </div>
      </section>
    </main>
  );
}
