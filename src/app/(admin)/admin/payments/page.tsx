import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { paymentStatusMeta } from "@/lib/domain-meta";
import { formatCurrency, formatDate } from "@/lib/format";
import { payments } from "@/mocks/subscription-data";

export default function AdminPaymentsPage() {
  const paidCount = payments.filter((payment) => payment.status === "paid").length;
  const failedCount = payments.filter((payment) => payment.status === "failed").length;
  const refundedCount = payments.filter(
    (payment) => payment.status === "refunded",
  ).length;

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="결제 운영"
        description="실패 결제, 환불 처리 완료, 정상 결제를 한 화면에서 비교해 운영팀이 우선 대응 대상을 빠르게 구분할 수 있도록 구성한 결제 화면입니다."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="정상 결제"
          value={`${paidCount}건`}
          description="정상적으로 청구가 완료된 결제 건수입니다."
        />
        <StatCard
          label="실패 결제"
          value={`${failedCount}건`}
          description="후속 조치가 필요한 실패 건수입니다."
        />
        <StatCard
          label="환불 처리"
          value={`${refundedCount}건`}
          description="이미 환불로 종료된 결제 건수입니다."
        />
      </section>

      <TableShell
        title="최근 결제 흐름"
        description="결제 수단과 상태를 함께 보여줘 운영자가 실패 건을 빠르게 식별할 수 있도록 구성했습니다."
        columns={["결제 ID", "상태", "금액", "결제 수단", "시도 시점"]}
      >
        {payments
          .toSorted((a, b) => b.attemptedAt.localeCompare(a.attemptedAt))
          .map((payment) => {
            const statusMeta = paymentStatusMeta[payment.status];

            return (
              <tr key={payment.id} className="border-t border-slate-200">
                <td className="px-6 py-4 text-sm font-medium text-slate-950">
                  {payment.id}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <StatusBadge
                    label={statusMeta.label}
                    tone={statusMeta.tone}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {payment.methodLabel}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatDate(payment.attemptedAt)}
                </td>
              </tr>
            );
          })}
      </TableShell>
    </main>
  );
}
