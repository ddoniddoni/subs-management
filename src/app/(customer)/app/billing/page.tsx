import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import { paymentStatusMeta } from "@/lib/domain-meta";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  currentCustomerId,
  invoices,
  payments,
} from "@/mocks/subscription-data";

export default function BillingPage() {
  const billingRows = invoices
    .filter((invoice) => {
      const payment = payments.find((item) => item.invoiceId === invoice.id);
      return payment?.customerId === currentCustomerId;
    })
    .map((invoice) => {
      const payment = payments.find((item) => item.invoiceId === invoice.id);
      const statusMeta = paymentStatusMeta[invoice.paymentStatus];

      return {
        invoiceNumber: invoice.number,
        amount: formatCurrency(invoice.amount),
        statusMeta,
        issuedAt: formatDate(invoice.issuedAt),
        methodLabel: payment?.methodLabel ?? "수단 미확인",
      };
    });

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="고객 계정"
        title="결제 내역"
        description="청구서 번호, 결제 수단, 처리 상태를 한눈에 확인할 수 있도록 실제 목업 데이터를 기반으로 구성한 결제 내역 화면입니다."
      />

      <TableShell
        title="최근 청구 내역"
        description="결제 성공, 환불 처리, 실패 건이 함께 보이도록 구성해 고객과 운영팀 모두 같은 맥락을 확인할 수 있게 합니다."
        columns={["청구서", "금액", "상태", "청구일", "결제 수단"]}
      >
        {billingRows.map((row) => (
          <tr key={row.invoiceNumber} className="border-t border-slate-200">
            <td className="px-6 py-4 text-sm font-medium text-slate-950">
              {row.invoiceNumber}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">{row.amount}</td>
            <td className="px-6 py-4 text-sm text-slate-600">
              <StatusBadge
                label={row.statusMeta.label}
                tone={row.statusMeta.tone}
              />
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              {row.issuedAt}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              {row.methodLabel}
            </td>
          </tr>
        ))}
      </TableShell>
    </main>
  );
}
