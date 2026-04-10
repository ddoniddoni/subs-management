import { CheckoutWorkbench } from "@/features/customer-acquisition/components/checkout-workbench";
import { getCustomerAcquisitionSnapshot } from "@/features/customer-acquisition/lib/customer-acquisition";
import { plans } from "@/mocks/subscription-data";

type CheckoutPageProps = {
  searchParams: Promise<{
    interval?: "monthly" | "annual";
    plan?: string;
  }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { interval, plan } = await searchParams;
  const snapshot = getCustomerAcquisitionSnapshot(plans);

  return (
    <CheckoutWorkbench
      initialBillingInterval={interval}
      initialPlanCode={plan}
      planCatalog={snapshot.planCatalog}
    />
  );
}
