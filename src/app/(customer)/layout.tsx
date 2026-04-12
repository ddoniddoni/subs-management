import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
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
              援щ룆 ?댁쁺 肄섏넄
            </Link>
            <p className="mt-1 text-sm text-slate-600">
              ?뚮옖 ?먯깋, checkout, 援щ룆 ?곹깭 ?뺤씤源뚯? ?댁뼱吏??怨좉컼???쒗뭹 ?먮쫫?낅땲??
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <ThemeToggle />
            <nav aria-label="怨좉컼 ?ㅻ퉬寃뚯씠??">
              <ul className="flex flex-wrap gap-2 lg:justify-end">
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
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
        {children}
      </div>
    </div>
  );
}
