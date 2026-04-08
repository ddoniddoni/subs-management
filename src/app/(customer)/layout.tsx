import Link from "next/link";
import type { ReactNode } from "react";

import { customerNavigationItems } from "@/lib/navigation";

type CustomerLayoutProps = {
  children: ReactNode;
};

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-slate-950"
            >
              구독 운영 콘솔
            </Link>
            <p className="mt-1 text-sm text-slate-600">
              요금제 탐색, 체크아웃, 계정 관리를 위한 고객용 제품 화면입니다.
            </p>
          </div>

          <nav aria-label="고객 내비게이션">
            <ul className="flex flex-wrap gap-2">
              {customerNavigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
        {children}
      </div>
    </div>
  );
}
