type ActionFeedbackBannerProps = {
  title?: string;
  message: string;
};

export function ActionFeedbackBanner({
  title = "처리 완료",
  message,
}: ActionFeedbackBannerProps) {
  return (
    <section
      aria-live="polite"
      className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5"
    >
      <p className="text-sm font-semibold text-emerald-700">{title}</p>
      <p className="mt-2 text-sm leading-6 text-emerald-700">{message}</p>
    </section>
  );
}
