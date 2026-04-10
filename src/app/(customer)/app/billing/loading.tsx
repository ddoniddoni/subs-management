import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function BillingLoading() {
  return (
    <main className="flex flex-col gap-6">
      <LoadingSkeleton lines={4} />
      <LoadingSkeleton lines={6} />
      <LoadingSkeleton lines={8} />
    </main>
  );
}
