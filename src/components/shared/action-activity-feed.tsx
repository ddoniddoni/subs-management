import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/format";
import type { ActionActivityItem } from "@/lib/workflow-activity";

type ActionActivityFeedProps = {
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  items: ActionActivityItem[];
  title: string;
};

export function ActionActivityFeed({
  description,
  emptyDescription,
  emptyTitle,
  items,
  title,
}: ActionActivityFeedProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          최근 처리 이력
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <ol className="mt-8 space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-950">
                {item.summary}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.detail}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                {formatDateTime(item.occurredAt)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
