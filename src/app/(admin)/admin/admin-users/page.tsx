import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { AdminAccessWorkbench } from "@/features/admin-users/components/admin-access-workbench";
import { getAdminAccessSnapshot } from "@/features/admin-users/lib/admin-access";
import { adminUsers, auditEvents } from "@/mocks/subscription-data";

export default function AdminUsersPage() {
  if (adminUsers.length === 0) {
    return (
      <main className="flex flex-col gap-10">
        <EmptyState
          title="운영자 계정이 아직 없습니다"
          description="관리자 계정이 연결되면 역할별 접근 제어와 감사 추적 구성을 이 화면에서 점검할 수 있습니다."
        />
      </main>
    );
  }

  const snapshot = getAdminAccessSnapshot({
    adminUsers,
    auditEvents,
  });

  if (!snapshot) {
    return (
      <main className="flex flex-col gap-10">
        <ErrorState
          title="관리자 권한 화면을 구성할 수 없습니다"
          description="운영자 데이터 또는 접근 정책 구성이 올바르지 않아 권한 요약 화면을 렌더링하지 못했습니다."
        />
      </main>
    );
  }

  return <AdminAccessWorkbench snapshot={snapshot} />;
}
