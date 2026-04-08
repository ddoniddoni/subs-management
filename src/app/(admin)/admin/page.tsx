import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { paymentStatusMeta, refundStatusMeta } from "@/lib/domain-meta";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  metricSnapshot,
  payments,
  refunds,
} from "@/mocks/subscription-data";

export default function AdminPage() {
  const highRiskPayments = payments.filter((payment) => payment.status === "failed");
  const pendingRefunds = refunds.filter((refund) => refund.status === "requested");

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="운영 대시보드 개요"
        description="반복 매출, 실패 결제, 환불 대기, 이탈률을 같은 기준에서 바라볼 수 있도록 실제 목업 지표와 대응 대상 목록을 연결한 화면입니다."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="활성 고객"
          value={metricSnapshot.activeCustomers.toLocaleString("ko-KR")}
          description={`${formatDate(metricSnapshot.capturedAt)} 기준으로 활성 상태를 유지 중인 고객 수입니다.`}
        />
        <StatCard
          label="월간 반복 매출"
          value={formatCurrency(metricSnapshot.monthlyRecurringRevenue)}
          description="운영 팀이 매출 상태를 빠르게 판단할 수 있는 핵심 지표입니다."
        />
        <StatCard
          label="결제 실패"
          value={`${metricSnapshot.failedPayments}건`}
          description="카드 만료나 한도 초과로 후속 대응이 필요한 결제 건수입니다."
        />
        <StatCard
          label="환불 대기"
          value={`${metricSnapshot.refundsPending}건`}
          description={`같은 시점 기준 예상 이탈률은 ${metricSnapshot.churnRate}%입니다.`}
        />
      </section>

      <TableShell
        title="우선 대응이 필요한 운영 항목"
        description="실패 결제와 환불 대기 건을 함께 확인해 당장 처리해야 할 운영 이슈를 파악할 수 있습니다."
        columns={["유형", "대상 ID", "상태", "금액", "발생 시점"]}
      >
        {highRiskPayments.map((payment) => {
          const statusMeta = paymentStatusMeta[payment.status];

          return (
            <tr key={payment.id} className="border-t border-slate-200">
              <td className="px-6 py-4 text-sm font-medium text-slate-950">
                결제
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{payment.id}</td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatCurrency(payment.amount)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDate(payment.attemptedAt)}
              </td>
            </tr>
          );
        })}
        {pendingRefunds.map((refund) => {
          const statusMeta = refundStatusMeta[refund.status];

          return (
            <tr key={refund.id} className="border-t border-slate-200">
              <td className="px-6 py-4 text-sm font-medium text-slate-950">
                환불
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{refund.id}</td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatCurrency(refund.amount)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDate(refund.requestedAt)}
              </td>
            </tr>
          );
        })}
      </TableShell>
    </main>
  );
}
