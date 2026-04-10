import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";

import { type CustomerSubscriptionSnapshot } from "../lib/customer-account";

type CustomerSubscriptionCenterProps = {
  snapshot: CustomerSubscriptionSnapshot;
};

export function CustomerSubscriptionCenter({
  snapshot,
}: CustomerSubscriptionCenterProps) {
  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="고객 계정"
        title={`${snapshot.customer.name}님의 구독 센터`}
        description={`${snapshot.customer.company} 워크스페이스의 현재 구독 상태와 다음 청구 흐름, 할인 혜택, 최근 결제 건강도를 한 화면에서 확인합니다.`}
      />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge
            label={snapshot.statusLabel}
            tone={snapshot.statusTone}
          />
          <StatusBadge
            label={snapshot.plan.name}
            tone="info"
          />
          {snapshot.activeCoupon ? (
            <StatusBadge
              label={`${snapshot.activeCoupon.code} 적용 중`}
              tone="warning"
            />
          ) : null}
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          {snapshot.billingHealthMessage}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {snapshot.recentBillingLabel}
        </p>
      </section>

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

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">구독 타임라인</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            가입 이후 현재 구독에 영향을 주는 주요 이벤트만 고객 시점으로 정리했습니다.
          </p>

          {snapshot.timeline.length > 0 ? (
            <ol className="mt-8 space-y-4">
              {snapshot.timeline.map((item) => (
                <li
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">
                      {item.title}
                    </h3>
                    <StatusBadge
                      label={item.dateLabel}
                      tone={item.tone}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="표시할 구독 이벤트가 없습니다"
                description="구독 시작, 할인 적용, 다음 청구 같은 이벤트가 생기면 이 영역에 정리됩니다."
              />
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">다음 액션</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            실제 변경 화면 대신, 지금 계정 상태에서 가장 자주 이어지는 self-service 경로를 정리했습니다.
          </p>

          <div className="mt-8 space-y-4">
            {snapshot.actions.map((action) => (
              <article
                key={action.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {action.title}
                  </h3>
                  <StatusBadge
                    label={action.hrefLabel}
                    tone={action.tone}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {action.description}
                </p>
                <div className="mt-4">
                  <Link
                    href={action.href}
                    className="text-sm font-semibold text-slate-950 transition hover:text-slate-700 hover:underline"
                  >
                    {action.hrefLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
