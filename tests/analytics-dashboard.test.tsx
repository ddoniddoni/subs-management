import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnalyticsDashboardView } from "@/features/analytics/components/analytics-dashboard-view";
import { getAnalyticsDashboardSnapshot } from "@/features/analytics/lib/analytics-dashboard";
import {
  coupons,
  customers,
  metricSnapshots,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

describe("getAnalyticsDashboardSnapshot", () => {
  it("builds analytics cards, trends, and risk queue", () => {
    const snapshot = getAnalyticsDashboardSnapshot({
      coupons,
      customers,
      metricSnapshots,
      payments,
      plans,
      refunds,
      subscriptions,
    });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.headlineCards).toHaveLength(4);
    expect(snapshot?.revenueTrend).toHaveLength(6);
    expect(snapshot?.riskQueue[0]?.href).toBe("/admin/payments");
    expect(snapshot?.planMix.length).toBeGreaterThan(0);
  });

  it("returns null when no metric snapshots exist", () => {
    const snapshot = getAnalyticsDashboardSnapshot({
      coupons,
      customers,
      metricSnapshots: [],
      payments,
      plans,
      refunds,
      subscriptions,
    });

    expect(snapshot).toBeNull();
  });
});

describe("AnalyticsDashboardView", () => {
  it("renders headline analytics and risk links", () => {
    const snapshot = getAnalyticsDashboardSnapshot({
      coupons,
      customers,
      metricSnapshots,
      payments,
      plans,
      refunds,
      subscriptions,
    });

    expect(snapshot).not.toBeNull();

    render(<AnalyticsDashboardView snapshot={snapshot!} />);

    expect(screen.getByText("분석 대시보드")).toBeInTheDocument();
    expect(screen.getByText("월간 반복 매출")).toBeInTheDocument();
    expect(screen.getByText("구독 상태 분포")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "상세 이동" })[0]).toHaveAttribute(
      "href",
      "/admin/payments",
    );
  });
});
