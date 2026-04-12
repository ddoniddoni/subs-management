import { SubscriptionStatusWorkbench } from "@/features/customers/components/subscription-status-workbench";
import {
  auditEvents,
  coupons,
  customers,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

type AdminSubscriptionsPageProps = {
  searchParams: Promise<{
    focus?: string | string[] | undefined;
  }>;
};

export default async function AdminSubscriptionsPage({
  searchParams,
}: AdminSubscriptionsPageProps) {
  const resolvedSearchParams = await searchParams;
  const focusSubscriptionId = Array.isArray(resolvedSearchParams.focus)
    ? resolvedSearchParams.focus[0]
    : resolvedSearchParams.focus;

  return (
    <SubscriptionStatusWorkbench
      auditEvents={auditEvents}
      coupons={coupons}
      customers={customers}
      initialFocusSubscriptionId={focusSubscriptionId}
      payments={payments}
      plans={plans}
      refunds={refunds}
      subscriptions={subscriptions}
    />
  );
}
