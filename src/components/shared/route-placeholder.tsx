type RoutePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
  bullets,
}: RoutePlaceholderProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          {eyebrow}
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      </div>

      <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Step 01 scaffold</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-2 w-2 rounded-full bg-slate-400"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
