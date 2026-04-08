import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import {
  paymentStatusMeta,
  subscriptionStatusMeta,
} from "@/lib/domain-meta";
import { customers, payments, plans, subscriptions } from "@/mocks/subscription-data";

export default function AdminCustomersPage() {
  const customerRows = customers.map((customer) => {
    const subscription = subscriptions.find(
      (item) => item.customerId === customer.id,
    );
    const plan = plans.find((item) => item.id === subscription?.planId);
    const latestPayment = payments
      .filter((item) => item.customerId === customer.id)
      .toSorted((a, b) => b.attemptedAt.localeCompare(a.attemptedAt))[0];

    return {
      name: customer.name,
      email: customer.email,
      planName: plan?.name ?? "미정",
      subscriptionMeta: subscription
        ? subscriptionStatusMeta[subscription.status]
        : { label: "구독 없음", tone: "neutral" as const },
      paymentMeta: latestPayment
        ? paymentStatusMeta[latestPayment.status]
        : { label: "결제 없음", tone: "neutral" as const },
    };
  });

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="고객 운영"
        description="실제 고객, 구독, 결제 목업 데이터를 한 화면에서 조합해 운영자가 어떤 상태를 우선 봐야 하는지 보여주는 테이블입니다."
      />

      <TableShell
        title="고객 목록"
        description="활성, 결제 지연, 해지 예정 고객이 한 화면에서 드러나도록 구성해 이후 검색과 필터 추가를 위한 기준 데이터를 마련합니다."
        columns={["고객명", "이메일", "플랜", "구독 상태", "최근 결제"]}
      >
        {customerRows.map((row) => (
          <tr key={row.name} className="border-t border-slate-200">
            <td className="px-6 py-4 text-sm font-medium text-slate-950">
              {row.name}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              {row.email}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              {row.planName}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              <StatusBadge
                label={row.subscriptionMeta.label}
                tone={row.subscriptionMeta.tone}
              />
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              <StatusBadge
                label={row.paymentMeta.label}
                tone={row.paymentMeta.tone}
              />
            </td>
          </tr>
        ))}
      </TableShell>

      <EmptyState
        title="저장된 고객 세그먼트는 아직 없습니다"
        description="다음 단계에서 검색과 필터가 추가되면, 자주 보는 고객 세그먼트나 저장된 뷰를 이 영역에 배치할 수 있습니다."
      />
    </main>
  );
}
