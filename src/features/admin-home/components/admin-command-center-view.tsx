import Link from "next/link";

import { ActionActivityFeed } from "@/components/shared/action-activity-feed";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { formatDateTime } from "@/lib/format";

import type { AdminCommandCenterSnapshot } from "../lib/admin-command-center";

type AdminCommandCenterViewProps = {
  snapshot: AdminCommandCenterSnapshot;
};

export function AdminCommandCenterView({
  snapshot,
}: AdminCommandCenterViewProps) {
  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="오늘의 운영 커맨드 센터"
        description={`${formatDateTime(snapshot.capturedAt)} 기준 데이터로 즉시 대응이 필요한 결제, 환불, 취소 예정 구독을 한 화면에 정리했습니다.`}
      />

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

      <TableShell
        title="우선 대응 큐"
        description="오늘 먼저 처리해야 하는 항목을 운영 영향도 기준으로 정리했습니다."
        columns={["항목", "설명", "규모", "상태", "이동"]}
      >
        {snapshot.priorityQueue.map((item) => (
          <tr
            key={item.id}
            className="border-t border-slate-200"
          >
            <td className="px-6 py-4 text-sm font-medium text-slate-950">{item.label}</td>
            <td className="px-6 py-4 text-sm leading-6 text-slate-600">{item.description}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.metric}</td>
            <td className="px-6 py-4 text-sm text-slate-600">
              <StatusBadge
                label={
                  item.tone === "danger"
                    ? "즉시 점검"
                    : item.tone === "warning"
                      ? "오늘 확인"
                      : "모니터링"
                }
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

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              빠른 진입
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              작업대로 바로 이동
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              홈에서 각 도메인 화면으로 한 번에 이동할 수 있도록 오늘 기준 수치를 함께 묶었습니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {snapshot.quickAccess.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <StatusBadge
                    label={item.metric}
                    tone="info"
                  />
                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-slate-950 transition hover:text-slate-700 hover:underline"
                  >
                    바로 열기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Watchlist
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              바로 봐야 하는 개별 건
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              큐 안에서도 특히 먼저 열어봐야 할 건을 상세 링크와 함께 추렸습니다.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {snapshot.watchlist.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                  <StatusBadge
                    label={item.tone === "danger" ? "위험" : item.tone === "warning" ? "확인" : "주의"}
                    tone={item.tone}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <div className="mt-4">
                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-slate-950 transition hover:text-slate-700 hover:underline"
                  >
                    관련 상세 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <ActionActivityFeed
        title="최근 운영 활동"
        description="마지막으로 어떤 관리 작업이 이뤄졌는지 홈 화면에서 바로 확인합니다."
        items={snapshot.recentActivity}
        emptyTitle="최근 운영 활동이 없습니다"
        emptyDescription="감사 이벤트가 쌓이면 관리자 홈에서 최근 활동 피드를 함께 보여줍니다."
      />
    </main>
  );
}
