type ActionFeedbackBannerProps = {
  tone?: "danger" | "success";
  title?: string;
  message: string;
};

export function ActionFeedbackBanner({
  tone = "success",
  title = tone === "success" ? "처리 완료" : "처리 실패",
  message,
}: ActionFeedbackBannerProps) {
  const palette =
    tone === "success"
      ? {
          border: "border-emerald-200",
          background: "bg-emerald-50",
          text: "text-emerald-700",
        }
      : {
          border: "border-rose-200",
          background: "bg-rose-50",
          text: "text-rose-700",
        };

  return (
    <section
      aria-live="polite"
      className={`rounded-3xl border p-5 ${palette.border} ${palette.background}`}
    >
      <p className={`text-sm font-semibold ${palette.text}`}>{title}</p>
      <p className={`mt-2 text-sm leading-6 ${palette.text}`}>{message}</p>
    </section>
  );
}
