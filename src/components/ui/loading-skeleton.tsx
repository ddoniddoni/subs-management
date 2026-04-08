type LoadingSkeletonProps = {
  lines?: number;
};

export function LoadingSkeleton({
  lines = 3,
}: LoadingSkeletonProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="animate-pulse space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 rounded-full bg-slate-200 ${
              index === lines - 1 ? "w-2/3" : "w-full"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
