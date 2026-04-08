import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";

const billingRows = [
  {
    invoice: "INV-240401",
    amount: "29,000원",
    status: { label: "결제 완료", tone: "success" as const },
    date: "2026-04-01",
  },
  {
    invoice: "INV-240301",
    amount: "29,000원",
    status: { label: "환불 처리", tone: "warning" as const },
    date: "2026-03-01",
  },
  {
    invoice: "INV-240201",
    amount: "29,000원",
    status: { label: "결제 실패", tone: "danger" as const },
    date: "2026-02-01",
  },
];

export default function BillingPage() {
  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="고객 계정"
        title="결제 내역"
        description="결제 내역 화면은 고객이 청구서, 결제 상태, 환불 여부를 빠르게 파악할 수 있도록 명확한 표 구조를 가져야 합니다."
      />

      <TableShell
        title="최근 청구 내역"
        description="현재는 UI 프리미티브 확인을 위한 샘플 행만 보여주고 있으며, 실제 결제 데이터는 이후 단계에서 연결됩니다."
        columns={["청구서", "금액", "상태", "결제일"]}
      >
        {billingRows.map((row) => (
          <tr key={row.invoice} className="border-t border-slate-200">
            <td className="px-6 py-4 text-sm font-medium text-slate-950">
              {row.invoice}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">{row.amount}</td>
            <td className="px-6 py-4 text-sm text-slate-600">
              <StatusBadge label={row.status.label} tone={row.status.tone} />
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">{row.date}</td>
          </tr>
        ))}
      </TableShell>
    </main>
  );
}
