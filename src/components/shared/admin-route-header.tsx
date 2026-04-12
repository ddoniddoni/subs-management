import Link from "next/link";

type AdminRouteBreadcrumb = {
  href?: string;
  label: string;
};

type AdminRouteQuickLink = {
  description: string;
  href: string;
  label: string;
};

type AdminRouteHeaderProps = {
  breadcrumbs: AdminRouteBreadcrumb[];
  description: string;
  eyebrow: string;
  quickLinks?: AdminRouteQuickLink[];
  title: string;
};

export function AdminRouteHeader({
  breadcrumbs,
  description,
  eyebrow,
  quickLinks = [],
  title,
}: AdminRouteHeaderProps) {
  return (
    <section className="flex flex-col gap-6">
      <nav
        aria-label="관리자 경로"
        className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
      >
        {breadcrumbs.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="transition hover:text-slate-700 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-slate-950">
                {item.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 ? (
              <span aria-hidden="true" className="text-slate-300">
                /
              </span>
            ) : null}
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            {description}
          </p>
        </header>

        {quickLinks.length > 0 ? (
          <section aria-label="관련 이동" className="grid gap-3 sm:grid-cols-2 xl:w-[28rem]">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-3xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </Link>
            ))}
          </section>
        ) : null}
      </div>
    </section>
  );
}
