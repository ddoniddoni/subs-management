import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function SubscriptionLoading() {
  return (
    <main className="flex flex-col gap-6">
      <LoadingSkeleton lines={4} />
      <LoadingSkeleton lines={6} />
      <LoadingSkeleton lines={5} />
    </main>
  );
}
