type ErrorStateProps = {
  title: string;
  description: string;
};

export function ErrorState({
  title,
  description,
}: ErrorStateProps) {
  return (
    <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
      <p className="text-lg font-semibold text-rose-700">{title}</p>
      <p className="mt-3 text-sm leading-6 text-rose-700/90">{description}</p>
    </section>
  );
}
