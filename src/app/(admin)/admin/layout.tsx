import Link from "next/link";
import type { ReactNode } from "react";

import { adminNavigationItems } from "@/lib/navigation";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-800 bg-slate-950 px-6 py-8 lg:border-b-0 lg:border-r">
          <Link
            href="/admin"
            className="text-lg font-semibold tracking-tight text-slate-50"
          >
            운영 콘솔 관리자
          </Link>
          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
            고객 운영, 결제 개입, 환불 처리, 감사 이력을 다루는 내부 운영
            워크스페이스입니다.
          </p>

          <nav aria-label="관리자 내비게이션" className="mt-8">
            <ul className="space-y-2">
              {adminNavigationItems.map((item) => (
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
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  관리자 작업 공간
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  구독 운영, 결제 처리, 환불 검토, 감사 기록 확인을 위한 관리자
                  영역입니다.
                </p>
              </div>

              <Link
                href="/"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                고객 화면으로 이동
              </Link>
            </div>
          </header>

          <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
