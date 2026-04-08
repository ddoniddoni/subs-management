export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Subscription Ops Console
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Clean starting point for the subscription product build.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          The default Next.js starter and bootstrap leftovers have been removed.
          This repo is ready for us to build the customer surface and the admin
          operations console from a minimal baseline.
        </p>
      </div>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Keep next</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Next.js App Router with TypeScript strict mode</li>
            <li>Tailwind CSS v4 baseline styling</li>
            <li>NPM lockfile and existing build tooling</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Build next</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Customer landing, pricing, and checkout flows</li>
            <li>Admin dashboard, tables, and operational workflows</li>
            <li>Shared domain models, fixtures, and reusable UI</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
