import { PageHeader } from "@/components/shared/page-header";

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
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          부트스트랩 안내
        </h2>
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
