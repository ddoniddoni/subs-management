import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdminCommandCenterView } from "@/features/admin-home/components/admin-command-center-view";
import { getAdminCommandCenterSnapshot } from "@/features/admin-home/lib/admin-command-center";
import {
  auditEvents,
  coupons,
  metricSnapshot,
  payments,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

describe("getAdminCommandCenterSnapshot", () => {
  it("builds priority queues, quick access, and recent activity", () => {
    const snapshot = getAdminCommandCenterSnapshot({
      auditEvents,
      coupons,
      metricSnapshot,
      payments,
      refunds,
      subscriptions,
    });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.headlineCards).toHaveLength(4);
    expect(snapshot?.priorityQueue[0]?.href).toBe("/admin/payments");
    expect(snapshot?.quickAccess).toHaveLength(4);
    expect(snapshot?.recentActivity.length).toBeGreaterThan(0);
  });

  it("returns null without a metric snapshot", () => {
    const snapshot = getAdminCommandCenterSnapshot({
      auditEvents,
      coupons,
      metricSnapshot: null,
      payments,
      refunds,
      subscriptions,
    });

    expect(snapshot).toBeNull();
  });
});

describe("AdminCommandCenterView", () => {
  it("renders the priority queue and quick access links", () => {
    const snapshot = getAdminCommandCenterSnapshot({
      auditEvents,
      coupons,
      metricSnapshot,
      payments,
      refunds,
      subscriptions,
    });

    expect(snapshot).not.toBeNull();

    const { container } = render(<AdminCommandCenterView snapshot={snapshot!} />);
    const hrefs = Array.from(container.querySelectorAll("a")).map((link) =>
      link.getAttribute("href"),
    );

    for (const item of snapshot!.priorityQueue) {
      expect(hrefs).toContain(item.href);
    }

    for (const item of snapshot!.quickAccess) {
      expect(hrefs).toContain(item.href);
    }
  });
});
