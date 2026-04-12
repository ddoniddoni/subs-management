import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";

import {
  getPlanAccentClasses,
  type CustomerAcquisitionSnapshot,
} from "../lib/customer-acquisition";

type CustomerLandingPageViewProps = {
  snapshot: CustomerAcquisitionSnapshot;
};

export function CustomerLandingPageView({
  snapshot,
}: CustomerLandingPageViewProps) {
  const featuredPlan =
    snapshot.planCatalog.find((plan) => plan.recommended) ?? snapshot.planCatalog[0];

  return (
    <main className="flex flex-col gap-10">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-10 px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <PageHeader
              eyebrow="고객용 앱"
              title="결제부터 운영까지 이어지는 구독 시작 화면"
              description="Subscription Ops Console은 고객이 플랜을 선택하고 첫 결제를 완료한 뒤, 운영팀이 같은 데이터로 결제 실패와 환불까지 이어서 대응할 수 있도록 설계된 구독 제품입니다."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                요금제 비교하기
              </Link>
              <Link
                href={featuredPlan?.checkoutHref ?? "/checkout"}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                바로 시작하기
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {snapshot.heroMetrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                    {metric.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {metric.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {featuredPlan ? (
            <aside className="theme-spotlight-panel rounded-[2rem] border border-teal-200 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge
                  label={featuredPlan.badgeLabel}
                  tone="success"
                />
                <StatusBadge
                  label={featuredPlan.audienceLabel}
                  tone="info"
                />
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                {featuredPlan.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {featuredPlan.description}
              </p>

              <div className="theme-glass-panel mt-6 rounded-3xl border p-5">
                <p className="text-sm font-medium text-slate-500">가장 많이 시작하는 조합</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                  {formatCurrency(featuredPlan.monthlyPrice)}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  월 결제 기준, 기본 {featuredPlan.seatsIncluded}석 포함
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  연간 전환 시 {formatCurrency(featuredPlan.annualSavings)} 절감
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {featuredPlan.highlightFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="theme-glass-panel rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {snapshot.valuePillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-950">{pillar.title}</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">{pillar.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            시작 흐름
          </p>
          <h2 className="text-2xl font-semibold text-slate-950">
            고객 획득부터 첫 청구 확인까지
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {snapshot.launchSteps.map((step) => (
            <article
              key={step.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {snapshot.planCatalog.map((plan) => (
          <article
            key={plan.code}
            className={`rounded-3xl border p-6 shadow-sm ${getPlanAccentClasses(plan.accent)}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge
                label={plan.badgeLabel}
                tone={plan.recommended ? "success" : "neutral"}
              />
              <StatusBadge
                label={plan.audienceLabel}
                tone="info"
              />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">{plan.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">{plan.description}</p>
            <p className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
              {formatCurrency(plan.monthlyPrice)}
            </p>
            <p className="mt-2 text-sm text-slate-700">월 결제 기준</p>
            <div className="mt-6">
              <Link
                href={plan.checkoutHref}
                className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                이 플랜으로 시작
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            FAQ
          </p>
          <h2 className="text-2xl font-semibold text-slate-950">
            도입 전에 자주 묻는 질문
          </h2>
        </div>
        <div className="mt-8 space-y-4">
          {snapshot.faqItems.map((faqItem) => (
            <article
              key={faqItem.question}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-950">{faqItem.question}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{faqItem.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
