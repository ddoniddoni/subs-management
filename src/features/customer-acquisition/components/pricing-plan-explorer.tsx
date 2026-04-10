"use client";

import Link from "next/link";
import { useState } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";

import {
  formatBillingPrice,
  getPlanAccentClasses,
  type CustomerAcquisitionSnapshot,
} from "../lib/customer-acquisition";

type PricingPlanExplorerProps = {
  snapshot: CustomerAcquisitionSnapshot;
};

export function PricingPlanExplorer({
  snapshot,
}: PricingPlanExplorerProps) {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">(
    "monthly",
  );

  return (
    <main className="flex flex-col gap-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              고객용 앱
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              팀 규모에 맞는 요금제를 비교하세요
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              고객은 요금제를 선택하고 checkout으로 이동하며, 운영팀은 같은 플랜 구조를 관리자 콘솔에서 그대로 추적하게 됩니다.
            </p>
          </div>

          <div
            className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1"
            role="tablist"
            aria-label="결제 주기 전환"
          >
            {[
              { value: "monthly", label: "월간 결제" },
              { value: "annual", label: "연간 결제" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={billingInterval === option.value}
                onClick={() => setBillingInterval(option.value as "monthly" | "annual")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  billingInterval === option.value
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-3">
          {snapshot.planCatalog.map((plan) => (
            <article
              key={plan.code}
              className={`rounded-[2rem] border p-6 shadow-sm ${getPlanAccentClasses(plan.accent)}`}
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

              <p className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">
                {formatBillingPrice(plan, billingInterval)}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {billingInterval === "monthly"
                  ? `월간 결제 · 기본 ${plan.seatsIncluded}석 포함`
                  : `연간 결제 · 2개월 할인 · 기본 ${plan.seatsIncluded}석 포함`}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                추가 좌석당 {formatBillingPrice(
                  {
                    ...plan,
                    monthlyPrice: plan.extraSeatPrice,
                    annualPrice: plan.extraSeatPrice * 10,
                  },
                  billingInterval,
                )}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.highlightFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`${plan.checkoutHref}&interval=${billingInterval}`}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  이 플랜으로 checkout
                </Link>
                <StatusBadge
                  label={
                    billingInterval === "annual"
                      ? `${plan.name} 연간 전환 시 ${plan.annualSavings.toLocaleString("ko-KR")}원 절감`
                      : "월 단위로 가볍게 시작"
                  }
                  tone={billingInterval === "annual" ? "warning" : "neutral"}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <TableShell
        title="기능 비교"
        description="플랜 카드는 시작점을 고르는 용도이고, 비교표는 팀 운영 방식에 맞는 플랜을 결정하는 용도입니다."
        columns={["비교 항목", "Starter", "Pro", "Team"]}
      >
        {snapshot.comparisonRows.map((row) => (
          <tr
            key={row.feature}
            className="border-t border-slate-200"
          >
            <td className="px-6 py-4 text-sm font-medium text-slate-950">{row.feature}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{row.values.starter}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{row.values.pro}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{row.values.team}</td>
          </tr>
        ))}
      </TableShell>
    </main>
  );
}
