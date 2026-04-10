import { Suspense, type ReactNode } from "react";

import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { AdminAccessShell } from "@/features/admin-users/components/admin-access-shell";
import { adminUsers } from "@/mocks/subscription-data";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={<AdminLayoutFallback />}>
      <AdminAccessShell adminUsers={adminUsers}>{children}</AdminAccessShell>
    </Suspense>
  );
}

function AdminLayoutFallback() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-800 bg-slate-950 px-6 py-8 lg:border-b-0 lg:border-r">
          <div className="h-6 w-40 animate-pulse rounded-full bg-slate-800" />
          <div className="mt-3 h-16 w-full animate-pulse rounded-3xl bg-slate-900" />
          <div className="mt-8 space-y-3">
            <div className="h-12 animate-pulse rounded-2xl bg-slate-900" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-900" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-900" />
          </div>
        </aside>

        <div className="bg-slate-100">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto w-full max-w-6xl px-6 py-5 sm:px-10">
              <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-3 h-4 w-96 animate-pulse rounded-full bg-slate-200" />
            </div>
          </header>

          <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
            <LoadingSkeleton lines={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
