import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function AdminPaymentDetailLoading() {
  return (
    <main className="flex flex-col gap-4">
      <LoadingSkeleton lines={4} />
      <LoadingSkeleton lines={6} />
      <LoadingSkeleton lines={5} />
    </main>
  );
}
