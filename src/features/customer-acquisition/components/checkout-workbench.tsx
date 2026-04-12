"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import type { BillingInterval } from "@/types/domain";

import {
  getCheckoutDefaultValues,
  getCheckoutSummary,
  validateCheckoutForm,
  type AcquisitionPlan,
  type CheckoutFormValues,
} from "../lib/customer-acquisition";

type CheckoutWorkbenchProps = {
  initialBillingInterval?: BillingInterval;
  initialPlanCode?: string | null;
  planCatalog: AcquisitionPlan[];
};

type CheckoutStatus = "idle" | "loading" | "success" | "error";

export function CheckoutWorkbench({
  initialBillingInterval,
  initialPlanCode,
  planCatalog,
}: CheckoutWorkbenchProps) {
  const initialValues = getCheckoutDefaultValues(planCatalog, initialPlanCode);
  const invalidRequestedPlan =
    Boolean(initialPlanCode) &&
    !planCatalog.some((plan) => plan.code === initialPlanCode);
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [orderReference, setOrderReference] = useState<string | null>(null);
  const submitTimerRef = useRef<number | null>(null);
  const [formValues, setFormValues] = useState<CheckoutFormValues | null>(() => {
    if (!initialValues) {
      return null;
    }

    return {
      ...initialValues,
      billingInterval: initialBillingInterval ?? initialValues.billingInterval,
    };
  });

  useEffect(() => {
    return () => {
      if (submitTimerRef.current !== null) {
        window.clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  const checkoutSummary = useMemo(() => {
    if (!formValues) {
      return null;
    }

    return getCheckoutSummary(planCatalog, formValues);
  }, [formValues, planCatalog]);

  if (planCatalog.length === 0) {
    return (
      <main className="flex flex-col gap-10">
        <EmptyState
          title="선택 가능한 플랜이 없습니다"
          description="요금제 구성이 준비되면 checkout에서 주문 요약과 결제 흐름을 이어서 진행할 수 있습니다."
        />
      </main>
    );
  }

  if (!formValues || !checkoutSummary || invalidRequestedPlan) {
    return (
      <main className="flex flex-col gap-10">
        <ErrorState
          title="선택한 플랜으로 checkout을 열 수 없습니다"
          description="요금제 링크가 오래됐거나 유효하지 않은 플랜 코드가 전달되었습니다. 요금제 화면에서 다시 시작해 주세요."
        />
      </main>
    );
  }

  const selectedPlan = checkoutSummary.selectedPlan;

  function updateFormValues(update: Partial<CheckoutFormValues>) {
    setFormValues((currentValues) =>
      currentValues
        ? {
            ...currentValues,
            ...update,
          }
        : currentValues,
    );
    setStatus("idle");
    setErrors([]);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formValues) {
      setStatus("error");
      setErrors(["선택한 플랜 정보를 다시 불러와 주세요."]);
      return;
    }

    const validation = validateCheckoutForm(planCatalog, formValues);

    if (!validation.ok) {
      setStatus("error");
      setErrors(validation.errors);
      return;
    }

    setStatus("loading");
    setErrors([]);

    submitTimerRef.current = window.setTimeout(() => {
      setStatus("success");
      setOrderReference(`SO-${Date.now().toString().slice(-6)}`);
    }, 900);
  }

  return (
    <main className="flex flex-col gap-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          고객용 앱
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          checkout
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          플랜 선택, 좌석 수, 프로모션 코드까지 반영된 주문 요약을 확인하고 첫 청구를 시작하는 목업 checkout입니다.
        </p>
      </section>

      {status === "success" ? (
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge
                label="주문 완료"
                tone="success"
              />
              <StatusBadge
                label={selectedPlan.name}
                tone="info"
              />
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
              {formValues.company} 워크스페이스가 준비되었습니다
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              {formValues.name} 님에게 시작 안내 메일을 보냈고, 첫 청구 상태는 내 구독과 결제 내역 화면에서 바로 확인할 수 있습니다.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="theme-glass-panel rounded-3xl border p-5">
                <p className="text-sm font-medium text-slate-500">주문 번호</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {orderReference}
                </p>
              </article>
              <article className="theme-glass-panel rounded-3xl border p-5">
                <p className="text-sm font-medium text-slate-500">첫 청구 금액</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {formatCurrency(checkoutSummary.totalAmount)}
                </p>
              </article>
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">다음으로 이어지는 화면</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              고객은 구독 상태를 확인하고, 운영팀은 같은 주문을 관리자 콘솔에서 추적하게 됩니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/app/subscription"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                내 구독 보기
              </Link>
              <Link
                href="/app/billing"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                결제 내역 보기
              </Link>
            </div>
          </article>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge
                label={selectedPlan.name}
                tone="info"
              />
              <StatusBadge
                label={checkoutSummary.billingLabel}
                tone="neutral"
              />
              <StatusBadge
                label={checkoutSummary.includedSeatsLabel}
                tone="warning"
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                담당자 이름
                <input
                  value={formValues.name}
                  onChange={(event) => updateFormValues({ name: event.target.value })}
                  placeholder="홍길동"
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                알림 이메일
                <input
                  value={formValues.email}
                  onChange={(event) => updateFormValues({ email: event.target.value })}
                  placeholder="team@company.kr"
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                회사명
                <input
                  value={formValues.company}
                  onChange={(event) => updateFormValues({ company: event.target.value })}
                  placeholder="TeamFit Labs"
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                좌석 수
                <input
                  type="number"
                  min={1}
                  value={formValues.seats}
                  onChange={(event) =>
                    updateFormValues({
                      seats: Number(event.target.value),
                    })
                  }
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
                />
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                플랜 선택
                <select
                  value={formValues.planCode}
                  onChange={(event) =>
                    updateFormValues({ planCode: event.target.value as CheckoutFormValues["planCode"] })
                  }
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
                >
                  {planCatalog.map((plan) => (
                    <option
                      key={plan.code}
                      value={plan.code}
                    >
                      {plan.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                결제 주기
                <select
                  value={formValues.billingInterval}
                  onChange={(event) =>
                    updateFormValues({
                      billingInterval: event.target.value as BillingInterval,
                    })
                  }
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
                >
                  <option value="monthly">월간 결제</option>
                  <option value="annual">연간 결제</option>
                </select>
              </label>
            </div>

            <label className="mt-6 flex flex-col gap-2 text-sm font-medium text-slate-700">
              프로모션 코드
              <input
                value={formValues.couponCode}
                onChange={(event) =>
                  updateFormValues({
                    couponCode: event.target.value.toUpperCase(),
                  })
                }
                placeholder="WELCOME-20"
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              />
            </label>

            {status === "error" && errors.length > 0 ? (
              <div className="mt-6">
                <ErrorState
                  title="checkout 정보를 다시 확인해 주세요"
                  description={errors.join(" ")}
                />
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                주문 시작
              </button>
              <Link
                href="/pricing"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                요금제 다시 보기
              </Link>
            </div>
          </form>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">주문 요약</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              프로모션 코드와 추가 좌석 비용까지 반영된 예상 청구 금액입니다.
            </p>

            {status === "loading" ? (
              <div className="mt-6">
                <LoadingSkeleton lines={5} />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <SummaryRow
                  label={`${selectedPlan.name} 기본 금액`}
                  value={formatCurrency(checkoutSummary.baseAmount)}
                />
                <SummaryRow
                  label={`추가 좌석 ${checkoutSummary.extraSeatCount}석`}
                  value={formatCurrency(checkoutSummary.extraSeatAmount)}
                />
                <SummaryRow
                  label="소계"
                  value={formatCurrency(checkoutSummary.subtotalAmount)}
                />
                <SummaryRow
                  label="프로모션 할인"
                  value={`-${formatCurrency(checkoutSummary.discountAmount)}`}
                />
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-700">예상 청구 금액</span>
                    <span className="text-2xl font-semibold text-slate-950">
                      {formatCurrency(checkoutSummary.totalAmount)}
                    </span>
                  </div>
                </div>

                {checkoutSummary.couponMessage ? (
                  <p className="text-sm leading-6 text-slate-600">
                    {checkoutSummary.couponMessage}
                  </p>
                ) : (
                  <p className="text-sm leading-6 text-slate-600">
                    활성 프로모션 코드를 입력하면 주문 요약에서 할인 금액이 바로 반영됩니다.
                  </p>
                )}
              </div>
            )}
          </aside>
        </section>
      )}
    </main>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}
