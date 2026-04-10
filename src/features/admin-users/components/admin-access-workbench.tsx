"use client";

import { startTransition, useDeferredValue, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { formatDateTime } from "@/lib/format";
import type { AdminRole } from "@/types/domain";

import {
  getAdminDirectoryResult,
  type AdminAccessSnapshot,
  type AdminDirectorySortKey,
} from "../lib/admin-access";

type AdminAccessWorkbenchProps = {
  snapshot: AdminAccessSnapshot;
};

const pageSize = 2;

const roleOptions: { label: string; value: AdminRole | "all" }[] = [
  { label: "전체 역할", value: "all" },
  { label: "뷰어", value: "viewer" },
  { label: "고객 지원", value: "support" },
  { label: "결제 관리자", value: "billing_manager" },
  { label: "운영 관리자", value: "ops_admin" },
];

const sortOptions: { label: string; value: AdminDirectorySortKey }[] = [
  { label: "최근 활동순", value: "last_active" },
  { label: "권한 높은 순", value: "role" },
  { label: "이름순", value: "name" },
];

export function AdminAccessWorkbench({
  snapshot,
}: AdminAccessWorkbenchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "all">("all");
  const [sortKey, setSortKey] = useState<AdminDirectorySortKey>("last_active");
  const [page, setPage] = useState(1);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const directory = getAdminDirectoryResult(snapshot.adminRows, {
    searchQuery: deferredSearchQuery,
    roleFilter,
    sortKey,
    page,
    pageSize,
  });

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 권한 운영"
        title="역할 기반 접근 제어를 운영합니다"
        description="운영자별 권한 범위, 접근 가능한 화면, 최근 감사 이력을 함께 점검해 민감한 관리자 워크플로우를 안전하게 유지합니다."
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Mock session guide</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {snapshot.sessionGuide}
            </p>
          </div>
          <StatusBadge
            label="UI-level access guard"
            tone="warning"
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {snapshot.roleSummaries.map((summary) => (
          <article
            key={summary.role}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-950">
                {summary.roleLabel}
              </h2>
              <StatusBadge
                label={`${summary.memberCount}명 배치`}
                tone={summary.tone}
              />
              <StatusBadge
                label={`${summary.accessibleRouteCount}개 화면`}
                tone="neutral"
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{summary.description}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {summary.capabilities.map((capability) => (
                <li key={capability}>
                  <StatusBadge
                    label={capability}
                    tone={summary.tone}
                  />
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              접근 가능 화면
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {summary.accessibleRouteLabels.join(", ")}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">운영자 디렉터리</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              검색, 역할 필터, 정렬, 페이지네이션으로 운영자 배치와 감사 이력을 빠르게 확인합니다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              운영자 검색
              <input
                value={searchQuery}
                onChange={(event) => {
                  const nextValue = event.target.value;

                  startTransition(() => {
                    setSearchQuery(nextValue);
                    setPage(1);
                  });
                }}
                placeholder="이름, 이메일, 역할"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              역할 필터
              <select
                value={roleFilter}
                onChange={(event) => {
                  const nextValue = event.target.value as AdminRole | "all";

                  startTransition(() => {
                    setRoleFilter(nextValue);
                    setPage(1);
                  });
                }}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              >
                {roleOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              정렬
              <select
                value={sortKey}
                onChange={(event) => {
                  const nextValue = event.target.value as AdminDirectorySortKey;

                  startTransition(() => {
                    setSortKey(nextValue);
                    setPage(1);
                  });
                }}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6">
          {directory.totalCount > 0 ? (
            <>
              <TableShell
                title="운영자 목록"
                description={`${directory.totalCount}명의 운영자를 권한 범위와 최근 감사 이력 기준으로 정리했습니다.`}
                columns={["운영자", "역할", "접근 범위", "최근 활동", "주요 업무"]}
              >
                {directory.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-200"
                  >
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-950">
                          {row.name}
                        </span>
                        <span className="text-sm text-slate-600">{row.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        <StatusBadge
                          label={row.roleLabel}
                          tone={row.roleTone}
                        />
                        <span className="text-sm text-slate-600">{row.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-sm leading-6 text-slate-600">
                      <p className="font-medium text-slate-950">
                        {row.accessibleRouteCount}개 화면
                      </p>
                      <p className="mt-2">{row.accessibleRouteLabel}</p>
                    </td>
                    <td className="px-6 py-4 align-top text-sm leading-6 text-slate-600">
                      <p className="font-medium text-slate-950">
                        {row.lastActiveAt ? formatDateTime(row.lastActiveAt) : "기록 없음"}
                      </p>
                      <p className="mt-2">{row.lastActionSummary}</p>
                    </td>
                    <td className="px-6 py-4 align-top text-sm leading-6 text-slate-600">
                      <p className="font-medium text-slate-950">{row.focusLabel}</p>
                    </td>
                  </tr>
                ))}
              </TableShell>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  페이지 {directory.page} / {directory.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      startTransition(() => {
                        setPage((currentPage) => Math.max(currentPage - 1, 1));
                      });
                    }}
                    disabled={directory.page === 1}
                    className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      startTransition(() => {
                        setPage((currentPage) =>
                          Math.min(currentPage + 1, directory.totalPages),
                        );
                      });
                    }}
                    disabled={directory.page === directory.totalPages}
                    className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    다음
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="조건에 맞는 운영자가 없습니다"
              description="검색어나 역할 필터를 조정하면 다른 운영자 권한 구성을 다시 확인할 수 있습니다."
            />
          )}
        </div>
      </section>

      <TableShell
        title="라우트 접근 매트릭스"
        description="세부 상세 페이지는 같은 상위 라우트 정책을 상속하도록 설계했습니다."
        columns={["화면", "용도", "허용 역할", "가드 수준"]}
      >
        {snapshot.routeRows.map((row) => (
          <tr
            key={row.href}
            className="border-t border-slate-200"
          >
            <td className="px-6 py-4 align-top">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-950">{row.label}</span>
                <span className="text-sm text-slate-600">{row.href}</span>
              </div>
            </td>
            <td className="px-6 py-4 align-top text-sm leading-6 text-slate-600">
              {row.description}
            </td>
            <td className="px-6 py-4 align-top">
              <div className="flex flex-wrap gap-2">
                {row.allowedRoles.map((role) => (
                  <StatusBadge
                    key={role.role}
                    label={role.label}
                    tone="neutral"
                  />
                ))}
              </div>
            </td>
            <td className="px-6 py-4 align-top">
              <StatusBadge
                label={row.guardLabel}
                tone={row.guardTone}
              />
            </td>
          </tr>
        ))}
      </TableShell>
    </main>
  );
}
