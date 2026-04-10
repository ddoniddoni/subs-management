import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import {
  buildAuditLogRecords,
  filterAuditLogRecords,
  getEntityTypeMeta,
  summarizeAuditLog,
} from "@/features/audit-log/lib/audit-log";
import { formatDateTime } from "@/lib/format";
import {
  adminUsers,
  auditEvents,
  coupons,
  customers,
  payments,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";
import type { AuditEvent } from "@/types/domain";

type AuditLogPageProps = {
  searchParams: Promise<{
    actor?: string;
    entity?: AuditEvent["entityType"];
  }>;
};

const entityFilterOptions: { label: string; value: AuditEvent["entityType"] }[] = [
  { label: "고객", value: "customer" },
  { label: "구독", value: "subscription" },
  { label: "결제", value: "payment" },
  { label: "환불", value: "refund" },
  { label: "쿠폰", value: "coupon" },
];

export default async function AuditLogPage({ searchParams }: AuditLogPageProps) {
  const resolvedSearchParams = await searchParams;
  const allRecords = buildAuditLogRecords({
    adminUsers,
    auditEvents,
    coupons,
    customers,
    payments,
    refunds,
    subscriptions,
  });
  const filteredRecords = filterAuditLogRecords(allRecords, {
    actorAdminUserId: resolvedSearchParams.actor,
    entityType: resolvedSearchParams.entity,
  });
  const summary = summarizeAuditLog(filteredRecords);

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="감사 로그"
        description="구독 상태 변경, 결제 개입, 환불 처리, 쿠폰 할당 같은 운영 이벤트를 수행자와 리소스 기준으로 추적하는 화면입니다."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="전체 이벤트"
          value={summary.total}
          description="현재 필터 조건에서 조회되는 감사 이벤트 수입니다."
        />
        <StatCard
          label="고위험 이벤트"
          value={summary.highRisk}
          description="결제와 환불처럼 운영 리스크가 높은 이벤트 수입니다."
        />
        <StatCard
          label="참여 관리자"
          value={summary.uniqueActors}
          description="현재 필터 조건에 포함된 이벤트를 수행한 관리자 수입니다."
        />
        <StatCard
          label="고객 연결 이벤트"
          value={summary.customerLinked}
          description="고객 상세 화면으로 바로 이동 가능한 이벤트 수입니다."
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            수행자 필터
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <FilterLink
              href={buildFilterHref(resolvedSearchParams, "actor", null)}
              isActive={!resolvedSearchParams.actor}
              label="전체 관리자"
            />
            {adminUsers.map((adminUser) => (
              <FilterLink
                key={adminUser.id}
                href={buildFilterHref(resolvedSearchParams, "actor", adminUser.id)}
                isActive={resolvedSearchParams.actor === adminUser.id}
                label={adminUser.name}
              />
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            엔티티 필터
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <FilterLink
              href={buildFilterHref(resolvedSearchParams, "entity", null)}
              isActive={!resolvedSearchParams.entity}
              label="전체 엔티티"
            />
            {entityFilterOptions.map((option) => (
              <FilterLink
                key={option.value}
                href={buildFilterHref(resolvedSearchParams, "entity", option.value)}
                isActive={resolvedSearchParams.entity === option.value}
                label={option.label}
              />
            ))}
          </div>
        </article>
      </section>

      <TableShell
        title="감사 이벤트 목록"
        description="수행자, 대상 리소스, 액션 요약, 발생 시점을 한 번에 검토할 수 있도록 정리했습니다."
        columns={["이벤트", "수행자", "대상", "시점", "이동"]}
      >
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => {
            const entityMeta = getEntityTypeMeta(record.entityType);

            return (
              <tr key={record.id} className="border-t border-slate-200">
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="space-y-2">
                    <StatusBadge label={entityMeta.label} tone={entityMeta.tone} />
                    <p className="font-medium text-slate-950">{record.summary}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {record.action}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-950">{record.actorLabel}</p>
                  <p className="mt-1">{record.actorRoleLabel}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-950">{record.targetId}</p>
                  <p className="mt-1">{record.entityLabel}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatDateTime(record.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {record.href ? (
                    <Link
                      href={record.href}
                      className="font-medium text-slate-700 transition hover:text-slate-950 hover:underline"
                    >
                      관련 화면 보기
                    </Link>
                  ) : (
                    "바로가기 없음"
                  )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr className="border-t border-slate-200">
            <td className="px-6 py-8" colSpan={5}>
              <EmptyState
                title="조건에 맞는 감사 이벤트가 없습니다"
                description="필터를 해제하거나 다른 관리자/엔티티 유형을 선택해 이벤트를 다시 확인해 보세요."
              />
            </td>
          </tr>
        )}
      </TableShell>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          최근 타임라인
        </p>
        {filteredRecords.length > 0 ? (
          <ol className="mt-6 space-y-4">
            {filteredRecords.slice(0, 5).map((record) => {
              const entityMeta = getEntityTypeMeta(record.entityType);

              return (
                <li
                  key={record.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge label={entityMeta.label} tone={entityMeta.tone} />
                    <p className="text-sm font-semibold text-slate-950">
                      {record.summary}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {record.actorLabel} · {record.actorRoleLabel}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    <span>{formatDateTime(record.createdAt)}</span>
                    <span>{record.targetId}</span>
                    {record.href ? (
                      <Link
                        href={record.href}
                        className="text-slate-700 transition hover:text-slate-950 hover:underline"
                      >
                        관련 화면 보기
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="표시할 타임라인이 없습니다"
              description="이벤트가 누적되면 최근 운영 변경이 이 영역에 시간순으로 표시됩니다."
            />
          </div>
        )}
      </section>
    </main>
  );
}

function buildFilterHref(
  currentParams: { actor?: string; entity?: AuditEvent["entityType"] },
  key: "actor" | "entity",
  value: string | null,
) {
  const params = new URLSearchParams();

  if (currentParams.actor) {
    params.set("actor", currentParams.actor);
  }
  if (currentParams.entity) {
    params.set("entity", currentParams.entity);
  }

  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  const query = params.toString();
  return query ? `/admin/audit-log?${query}` : "/admin/audit-log";
}

function FilterLink({
  href,
  isActive,
  label,
}: {
  href: string;
  isActive: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        isActive
          ? "border-slate-900 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {label}
    </Link>
  );
}
