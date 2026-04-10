import type { AuditEvent } from "@/types/domain";

export type ActionActivityItem = {
  detail: string;
  id: string;
  occurredAt: string;
  summary: string;
};

export function mapAuditEventsToActivityItems(
  auditEvents: AuditEvent[],
): ActionActivityItem[] {
  return auditEvents
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((event) => ({
      id: event.id,
      occurredAt: event.createdAt,
      summary: event.summary,
      detail: `${event.entityType} · ${event.targetId}`,
    }));
}
