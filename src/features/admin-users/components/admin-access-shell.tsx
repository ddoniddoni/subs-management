"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { ErrorState } from "@/components/ui/error-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { adminRoleLabel } from "@/lib/domain-meta";
import type { AdminUser } from "@/types/domain";

import {
  buildAdminHref,
  canAccessAdminRoute,
  defaultAdminUserId,
  getAdminNavigationForRole,
  getAdminRoutePolicy,
  resolveActiveAdminUser,
} from "../lib/admin-access";

type AdminAccessShellProps = {
  adminUsers: AdminUser[];
  children: ReactNode;
};
export function AdminAccessShell({
  adminUsers,
  children,
}: AdminAccessShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryAdminUserId = searchParams.get("admin");

  const activeAdminUser =
    resolveActiveAdminUser(adminUsers, queryAdminUserId) ??
    resolveActiveAdminUser(adminUsers, defaultAdminUserId);

  if (!activeAdminUser) {
    return <>{children}</>;
  }

  const navigationItems = getAdminNavigationForRole(activeAdminUser.role).map((item) => ({
    ...item,
    href: buildAdminHref(item.href, activeAdminUser.id),
  }));
  const activeRoutePolicy = getAdminRoutePolicy(pathname);
  const isAllowed = canAccessAdminRoute(activeAdminUser.role, pathname);
  const fallbackItems = navigationItems
    .filter((item) => item.href !== buildAdminHref(pathname, activeAdminUser.id))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-800 bg-slate-950 px-6 py-8 lg:border-b-0 lg:border-r">
          <Link
            href={buildAdminHref("/admin", activeAdminUser.id)}
            className="text-lg font-semibold tracking-tight text-slate-50"
          >
            운영 콘솔 관리자
          </Link>
          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
            고객 운영, 결제 개입, 환불 처리, 감사 이력을 한 화면에서 관리하는 운영 콘솔입니다.
          </p>

          <nav
            aria-label="관리자 네비게이션"
            className="mt-8"
          >
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="bg-slate-100">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-5 sm:px-10 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  관리자 작업 공간
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  구독 운영, 결제 처리, 환불 검토, 감사 로그 확인을 위한 관리자 영역입니다.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={`${activeAdminUser.name} 세션`}
                    tone="info"
                  />
                  <StatusBadge
                    label={adminRoleLabel[activeAdminUser.role]}
                    tone="neutral"
                  />
                  {activeRoutePolicy ? (
                    <StatusBadge
                      label={`${activeRoutePolicy.label} 접근 ${isAllowed ? "허용" : "차단"}`}
                      tone={isAllowed ? "success" : "danger"}
                    />
                  ) : null}
                </div>
              </div>

              <div className="flex max-w-xl flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Mock session
                </p>
                <div className="flex flex-wrap gap-2">
                  {adminUsers.map((adminUser) => (
                    <Link
                      key={adminUser.id}
                      href={buildAdminHref(pathname, adminUser.id)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        adminUser.id === activeAdminUser.id
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-950 hover:text-slate-950"
                      }`}
                    >
                      {adminUser.name} · {adminRoleLabel[adminUser.role]}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
                >
                  고객 화면으로 이동
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
            {isAllowed ? (
              children
            ) : (
              <main className="flex flex-col gap-6">
                <ErrorState
                  title="현재 운영자 역할로는 이 화면에 접근할 수 없습니다"
                  description={`${adminRoleLabel[activeAdminUser.role]} 역할은 ${activeRoutePolicy?.label ?? "현재 화면"}에 접근할 수 없습니다. 권한 범위를 검토하거나 허용된 화면으로 이동하세요.`}
                />

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-950">이 역할로 이동 가능한 화면</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    같은 mock session을 유지한 채 접근 가능한 운영 화면으로 바로 이동할 수 있습니다.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {fallbackItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </section>
              </main>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
