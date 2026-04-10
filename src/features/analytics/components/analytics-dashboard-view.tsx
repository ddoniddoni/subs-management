import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { formatDate } from "@/lib/format";

import type { AnalyticsDashboardSnapshot } from "../lib/analytics-dashboard";

type AnalyticsDashboardViewProps = {
  snapshot: AnalyticsDashboardSnapshot;
};

export function AnalyticsDashboardView({
  snapshot,
}: AnalyticsDashboardViewProps) {
  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="분석 대시보드"
        description={`${formatDate(snapshot.capturedAt)} 기준 KPI와 운영 리스크를 추세 중심으로 확인합니다.`}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.headlineCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            description={`${card.description} 변화량 ${card.delta}`}
          />
        ))}
      </section>

      {snapshot.revenueTrend.length > 0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              추이 분석
            </p>
            <h2 className="text-2xl font-semibold text-slate-950">
              MRR / 활성 고객 / 실패 결제
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              최근 6개 시점 기준 매출 성장과 리스크 신호를 함께 봅니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-6">
            {snapshot.revenueTrend.map((point) => (
              <article
                key={point.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex h-36 items-end">
                  <div
                    className="w-full rounded-t-2xl bg-slate-950"
                    style={{ height: `${point.heightPercent}%` }}
                  />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-950">{point.label}</p>
                <p className="mt-2 text-sm text-slate-600">{point.revenueLabel}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  활성 {point.activeCustomers.toLocaleString("ko-KR")} / 실패 {point.failedPayments}건
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="추이 데이터가 없습니다"
          description="시계열 metric snapshot이 준비되면 분석 차트가 이 영역에 표시됩니다."
        />
      )}

      <section className="grid gap-4 xl:grid-cols-3">
        <AnalyticsMetricList
          title="구독 상태 분포"
          description="현재 구독 상태가 어떤 리스크에 몰려 있는지 확인합니다."
          items={snapshot.statusMix}
        />
        <AnalyticsMetricList
          title="플랜 분포"
          description="현재 고객이 어떤 플랜에 집중돼 있는지 보여줍니다."
          items={snapshot.planMix}
        />
        <AnalyticsMetricList
          title="고객 세그먼트 분포"
          description="고객군별 구성을 빠르게 파악해 운영 우선순위를 세울 수 있습니다."
          items={snapshot.segmentMix}
        />
      </section>

      <TableShell
        title="운영 리스크 큐"
        description="즉시 대응이 필요한 영역을 분석 화면에서도 바로 확인할 수 있게 묶었습니다."
        columns={["항목", "건수", "상태", "이동"]}
      >
        {snapshot.riskQueue.map((item) => (
          <tr key={item.id} className="border-t border-slate-200">
            <td className="px-6 py-4 text-sm font-medium text-slate-950">{item.label}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.metric}</td>
            <td className="px-6 py-4 text-sm text-slate-600">
              <StatusBadge
                label={item.tone === "danger" ? "우선 대응" : item.tone === "warning" ? "검토 필요" : "모니터링"}
                tone={item.tone}
              />
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              <Link
                href={item.href}
                className="font-medium text-slate-950 transition hover:text-slate-700 hover:underline"
              >
                상세 이동
              </Link>
            </td>
          </tr>
        ))}
      </TableShell>
    </main>
  );
}

function AnalyticsMetricList({
  description,
  items,
  title,
}: {
  description: string;
  items: { label: string; value: string }[];
  title: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

      {items.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <span className="text-sm font-semibold text-slate-950">{item.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="표시할 데이터가 없습니다"
            description="관련 지표가 준비되면 이 분포 영역에 값이 채워집니다."
          />
        </div>
      )}
    </section>
  );
}
