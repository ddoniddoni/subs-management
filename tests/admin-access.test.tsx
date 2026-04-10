import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AdminAccessWorkbench } from "@/features/admin-users/components/admin-access-workbench";
import { AdminAccessShell } from "@/features/admin-users/components/admin-access-shell";
import {
  canAccessAdminRoute,
  getAdminAccessSnapshot,
  getAdminDirectoryResult,
} from "@/features/admin-users/lib/admin-access";
import { adminUsers, auditEvents } from "@/mocks/subscription-data";

let mockPathname = "/admin/admin-users";
let mockSearchParams = new URLSearchParams("admin=admin_002");

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe("admin access helpers", () => {
  it("matches nested admin detail routes by parent policy", () => {
    expect(canAccessAdminRoute("billing_manager", "/admin/payments/pay_001")).toBe(true);
    expect(canAccessAdminRoute("support", "/admin/payments/pay_001")).toBe(false);
    expect(canAccessAdminRoute("viewer", "/admin/customers/cust_001")).toBe(true);
  });

  it("filters, sorts, and paginates admin directory rows", () => {
    const snapshot = getAdminAccessSnapshot({
      adminUsers,
      auditEvents,
    });

    expect(snapshot).not.toBeNull();

    const directory = getAdminDirectoryResult(snapshot!.adminRows, {
      searchQuery: "",
      roleFilter: "all",
      sortKey: "last_active",
      page: 1,
      pageSize: 2,
    });

    expect(directory.rows).toHaveLength(2);
    expect(directory.totalPages).toBe(2);
    expect(directory.rows[0]?.id).toBe("admin_003");
  });
});

describe("AdminAccessShell", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockPathname = "/admin/admin-users";
    mockSearchParams = new URLSearchParams("admin=admin_002");
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("blocks disallowed routes for the selected admin role", async () => {
    render(
      <AdminAccessShell adminUsers={adminUsers}>
        <div>secret admin content</div>
      </AdminAccessShell>,
    );

    expect(
      await screen.findByText("현재 운영자 역할로는 이 화면에 접근할 수 없습니다"),
    ).toBeInTheDocument();
    expect(screen.queryByText("secret admin content")).not.toBeInTheDocument();
    expect(screen.getByText("결제 관리자")).toBeInTheDocument();
  });

  it("renders children for an allowed route and keeps the session switcher", async () => {
    mockPathname = "/admin/payments";

    render(
      <AdminAccessShell adminUsers={adminUsers}>
        <div>payment workbench</div>
      </AdminAccessShell>,
    );

    expect(await screen.findByText("payment workbench")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /정하은/ })).toBeInTheDocument();
  });
});

describe("AdminAccessWorkbench", () => {
  it("renders role summaries and route matrix", () => {
    const snapshot = getAdminAccessSnapshot({
      adminUsers,
      auditEvents,
    });

    expect(snapshot).not.toBeNull();

    render(<AdminAccessWorkbench snapshot={snapshot!} />);

    expect(screen.getByText("역할 기반 접근 제어를 운영합니다")).toBeInTheDocument();
    expect(screen.getByLabelText("운영자 검색")).toBeInTheDocument();
    expect(screen.getByText("라우트 접근 매트릭스")).toBeInTheDocument();
    expect(screen.getAllByText("운영 관리자").length).toBeGreaterThan(0);
  });
});
