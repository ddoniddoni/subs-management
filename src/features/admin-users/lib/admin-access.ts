import { adminRoleLabel, type BadgeTone } from "@/lib/domain-meta";
import { adminNavigationItems, type NavigationItem } from "@/lib/navigation";
import type { AdminRole, AdminUser, AuditEvent } from "@/types/domain";

export const defaultAdminUserId = "admin_001";

type RoleMeta = {
  description: string;
  capabilities: string[];
  tone: BadgeTone;
};

type AdminRoutePolicy = {
  href: string;
  label: string;
  description: string;
  allowedRoles: AdminRole[];
};

export type AdminHeadlineCard = {
  label: string;
  value: string;
  description: string;
};

export type AdminRoleSummary = {
  role: AdminRole;
  roleLabel: string;
  description: string;
  capabilities: string[];
  memberCount: number;
  accessibleRouteCount: number;
  accessibleRouteLabels: string[];
  tone: BadgeTone;
};

export type AdminDirectoryRow = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  roleTone: BadgeTone;
  focusLabel: string;
  accessibleRouteCount: number;
  accessibleRouteLabel: string;
  lastActiveAt: string | null;
  lastActionSummary: string;
};

export type AdminRouteRow = {
  href: string;
  label: string;
  description: string;
  allowedRoles: {
    role: AdminRole;
    label: string;
  }[];
  guardTone: BadgeTone;
  guardLabel: string;
};

export type AdminAccessSnapshot = {
  headlineCards: AdminHeadlineCard[];
  roleSummaries: AdminRoleSummary[];
  adminRows: AdminDirectoryRow[];
  routeRows: AdminRouteRow[];
  sessionGuide: string;
};

export type AdminDirectorySortKey = "name" | "role" | "last_active";

export type AdminDirectoryFilters = {
  searchQuery: string;
  roleFilter: AdminRole | "all";
  sortKey: AdminDirectorySortKey;
  page: number;
  pageSize: number;
};

export type AdminDirectoryResult = {
  rows: AdminDirectoryRow[];
  totalCount: number;
  totalPages: number;
  page: number;
};

const roleMeta: Record<AdminRole, RoleMeta> = {
  viewer: {
    description: "핵심 KPI와 고객 상태를 조회하지만 결제나 환불 같은 민감한 조작은 하지 않습니다.",
    capabilities: ["운영 현황 보기", "고객 목록 조회", "고객 상세 점검"],
    tone: "neutral",
  },
  support: {
    description: "고객 문의 대응과 구독 상태 관리, 쿠폰 운영을 담당하는 지원 역할입니다.",
    capabilities: ["고객 대응", "구독 상태 변경", "쿠폰 발급/회수"],
    tone: "info",
  },
  billing_manager: {
    description: "결제 실패 대응, 환불 검토, 매출 분석을 맡는 재무 운영 역할입니다.",
    capabilities: ["결제 실패 조치", "환불 승인/반려", "매출 분석"],
    tone: "warning",
  },
  ops_admin: {
    description: "전체 운영 흐름과 민감한 관리자 설정을 총괄하는 최고 권한 역할입니다.",
    capabilities: ["전체 콘솔 접근", "권한 검토", "감사 로그 점검"],
    tone: "danger",
  },
};

const adminRoutePolicies: AdminRoutePolicy[] = [
  {
    href: "/admin",
    label: "개요",
    description: "운영 KPI와 오늘의 우선 대응 항목을 확인합니다.",
    allowedRoles: ["viewer", "support", "billing_manager", "ops_admin"],
  },
  {
    href: "/admin/customers",
    label: "고객",
    description: "고객 상태, 구독 현황, 고객 상세 정보를 조회합니다.",
    allowedRoles: ["viewer", "support", "ops_admin"],
  },
  {
    href: "/admin/payments",
    label: "결제",
    description: "결제 실패를 검토하고 결제 상세 이력을 점검합니다.",
    allowedRoles: ["billing_manager", "ops_admin"],
  },
  {
    href: "/admin/refunds",
    label: "환불",
    description: "환불 승인/반려와 환불 상세 검토를 수행합니다.",
    allowedRoles: ["billing_manager", "ops_admin"],
  },
  {
    href: "/admin/coupons",
    label: "쿠폰",
    description: "보상 쿠폰 발급과 회수 흐름을 운영합니다.",
    allowedRoles: ["support", "ops_admin"],
  },
  {
    href: "/admin/analytics",
    label: "분석",
    description: "매출과 위험 지표를 분석해 운영 우선순위를 정합니다.",
    allowedRoles: ["billing_manager", "ops_admin"],
  },
  {
    href: "/admin/admin-users",
    label: "관리자",
    description: "관리자 역할, 권한 범위, 접근 정책을 검토합니다.",
    allowedRoles: ["ops_admin"],
  },
  {
    href: "/admin/audit-log",
    label: "감사 로그",
    description: "민감한 운영 액션과 변경 이력을 추적합니다.",
    allowedRoles: ["ops_admin"],
  },
];

const roleOrder: Record<AdminRole, number> = {
  viewer: 0,
  support: 1,
  billing_manager: 2,
  ops_admin: 3,
};

export function getAdminRoutePolicies() {
  return adminRoutePolicies;
}

export function resolveActiveAdminUser(
  adminUsers: AdminUser[],
  adminUserId?: string | null,
) {
  return (
    adminUsers.find((adminUser) => adminUser.id === adminUserId) ??
    adminUsers.find((adminUser) => adminUser.id === defaultAdminUserId) ??
    adminUsers[0] ??
    null
  );
}

export function getAdminNavigationForRole(role: AdminRole): NavigationItem[] {
  return adminNavigationItems.filter((item) => canAccessAdminRoute(role, item.href));
}

export function getAdminRoutePolicy(pathname: string) {
  return [...adminRoutePolicies]
    .sort((left, right) => right.href.length - left.href.length)
    .find((policy) => {
      if (policy.href === "/admin") {
        return pathname === "/admin";
      }

      return pathname === policy.href || pathname.startsWith(`${policy.href}/`);
    });
}

export function canAccessAdminRoute(role: AdminRole, pathname: string) {
  const policy = getAdminRoutePolicy(pathname);

  if (!policy) {
    return false;
  }

  return policy.allowedRoles.includes(role);
}

export function buildAdminHref(href: string, adminUserId: string) {
  const [pathname, queryString] = href.split("?");
  const searchParams = new URLSearchParams(queryString ?? "");

  searchParams.set("admin", adminUserId);

  const serialized = searchParams.toString();

  return serialized.length > 0 ? `${pathname}?${serialized}` : pathname;
}

export function getAdminAccessSnapshot({
  adminUsers,
  auditEvents,
}: {
  adminUsers: AdminUser[];
  auditEvents: AuditEvent[];
}) {
  if (adminUsers.length === 0) {
    return null;
  }

  const roleSummaries = (Object.keys(adminRoleLabel) as AdminRole[]).map((role) => {
    const members = adminUsers.filter((adminUser) => adminUser.role === role);
    const accessibleRoutes = adminRoutePolicies.filter((policy) =>
      policy.allowedRoles.includes(role),
    );

    return {
      role,
      roleLabel: adminRoleLabel[role],
      description: roleMeta[role].description,
      capabilities: roleMeta[role].capabilities,
      memberCount: members.length,
      accessibleRouteCount: accessibleRoutes.length,
      accessibleRouteLabels: accessibleRoutes.map((route) => route.label),
      tone: roleMeta[role].tone,
    } satisfies AdminRoleSummary;
  });

  const adminRows = adminUsers.map((adminUser) => {
    const accessibleRoutes = adminRoutePolicies.filter((policy) =>
      policy.allowedRoles.includes(adminUser.role),
    );
    const lastAuditEvent = [...auditEvents]
      .filter((auditEvent) => auditEvent.actorAdminUserId === adminUser.id)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0];

    return {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      roleLabel: adminRoleLabel[adminUser.role],
      roleTone: roleMeta[adminUser.role].tone,
      focusLabel: roleMeta[adminUser.role].capabilities[0],
      accessibleRouteCount: accessibleRoutes.length,
      accessibleRouteLabel:
        accessibleRoutes.length === adminRoutePolicies.length
          ? "전체 운영 화면"
          : accessibleRoutes.map((route) => route.label).join(", "),
      lastActiveAt: lastAuditEvent?.createdAt ?? null,
      lastActionSummary: lastAuditEvent?.summary ?? "최근 감사 로그 기록이 없습니다.",
    } satisfies AdminDirectoryRow;
  });

  const routeRows = adminRoutePolicies.map((policy) => {
    const allowedRoles = policy.allowedRoles.map((role) => ({
      role,
      label: adminRoleLabel[role],
    }));

    return {
      href: policy.href,
      label: policy.label,
      description: policy.description,
      allowedRoles,
      guardTone:
        policy.allowedRoles.length === 1
          ? "danger"
          : policy.allowedRoles.length === 2
            ? "warning"
            : "info",
      guardLabel:
        policy.allowedRoles.length === 1
          ? "최고 권한 전용"
          : policy.allowedRoles.length === 2
            ? "제한 접근"
            : "공유 접근",
    } satisfies AdminRouteRow;
  });

  const staffedRoles = roleSummaries.filter((summary) => summary.memberCount > 0).length;
  const auditedAdmins = adminRows.filter((row) => row.lastActiveAt !== null).length;
  const restrictedRoutes = routeRows.filter((row) => row.allowedRoles.length <= 2).length;

  return {
    headlineCards: [
      {
        label: "운영자 수",
        value: `${adminUsers.length}명`,
        description: "현재 콘솔에 배치된 운영자 계정 수입니다.",
      },
      {
        label: "배치된 역할",
        value: `${staffedRoles}/${roleSummaries.length}`,
        description: "정의된 역할 중 실제 인력이 배치된 범위입니다.",
      },
      {
        label: "제한 라우트",
        value: `${restrictedRoutes}개`,
        description: "민감도가 높아 일부 역할만 접근 가능한 화면 수입니다.",
      },
      {
        label: "감사 추적 가능",
        value: `${auditedAdmins}/${adminUsers.length}`,
        description: "최근 감사 로그로 활동 흔적을 추적할 수 있는 운영자 수입니다.",
      },
    ],
    roleSummaries,
    adminRows,
    routeRows,
    sessionGuide:
      "상단 mock session 전환기를 사용하면 현재 운영자 역할에 맞춰 메뉴와 접근 가드가 바로 바뀝니다.",
  } satisfies AdminAccessSnapshot;
}

export function getAdminDirectoryResult(
  rows: AdminDirectoryRow[],
  filters: AdminDirectoryFilters,
): AdminDirectoryResult {
  const normalizedQuery = filters.searchQuery.trim().toLowerCase();

  let filteredRows = rows.filter((row) => {
    if (filters.roleFilter !== "all" && row.role !== filters.roleFilter) {
      return false;
    }

    if (normalizedQuery.length === 0) {
      return true;
    }

    return [row.name, row.email, row.roleLabel, row.focusLabel]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  filteredRows = [...filteredRows].sort((left, right) => {
    if (filters.sortKey === "name") {
      return left.name.localeCompare(right.name, "ko");
    }

    if (filters.sortKey === "role") {
      return roleOrder[right.role] - roleOrder[left.role];
    }

    if (left.lastActiveAt === right.lastActiveAt) {
      return left.name.localeCompare(right.name, "ko");
    }

    if (left.lastActiveAt === null) {
      return 1;
    }

    if (right.lastActiveAt === null) {
      return -1;
    }

    return right.lastActiveAt.localeCompare(left.lastActiveAt);
  });

  const totalCount = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));
  const page = Math.min(Math.max(filters.page, 1), totalPages);
  const startIndex = (page - 1) * filters.pageSize;
  const endIndex = startIndex + filters.pageSize;

  return {
    rows: filteredRows.slice(startIndex, endIndex),
    totalCount,
    totalPages,
    page,
  };
}
