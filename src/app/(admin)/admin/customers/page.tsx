import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";

const customerRows = [
  {
    name: "김민서",
    plan: "프로 플랜",
    status: { label: "활성", tone: "success" as const },
    payment: { label: "정상 결제", tone: "info" as const },
  },
  {
    name: "이도윤",
    plan: "팀 플랜",
    status: { label: "결제 지연", tone: "warning" as const },
    payment: { label: "재시도 필요", tone: "warning" as const },
  },
  {
    name: "박서준",
    plan: "스타터 플랜",
    status: { label: "해지 예정", tone: "danger" as const },
    payment: { label: "최근 실패", tone: "danger" as const },
  },
];

export default function AdminCustomersPage() {
  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="고객 운영"
        description="고객 목록 화면은 검색, 필터, 상태 파악의 중심이 되므로 테이블 셸과 상태 배지가 먼저 안정적으로 준비되어야 합니다."
      />

      <TableShell
        title="고객 목록 미리보기"
        description="현재는 공통 UI를 검증하기 위한 샘플 행만 넣어두었고, 실제 고객 데이터와 필터는 다음 단계에서 추가됩니다."
        columns={["고객명", "플랜", "구독 상태", "최근 결제"]}
      >
        {customerRows.map((row) => (
          <tr key={row.name} className="border-t border-slate-200">
            <td className="px-6 py-4 text-sm font-medium text-slate-950">
              {row.name}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">{row.plan}</td>
            <td className="px-6 py-4 text-sm text-slate-600">
              <StatusBadge label={row.status.label} tone={row.status.tone} />
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              <StatusBadge label={row.payment.label} tone={row.payment.tone} />
            </td>
          </tr>
        ))}
      </TableShell>

      <EmptyState
        title="저장된 고객 세그먼트가 아직 없습니다"
        description="다음 단계에서 검색과 필터가 추가되면, 자주 보는 고객 세그먼트나 저장된 뷰를 이 영역에 배치할 수 있습니다."
      />
    </main>
  );
}
