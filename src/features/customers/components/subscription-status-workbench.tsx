"use client";

import Link from "next/link";
import { useState } from "react";

import { ActionActivityFeed } from "@/components/shared/action-activity-feed";
import { ActionFeedbackBanner } from "@/components/shared/action-feedback-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableShell } from "@/components/ui/table-shell";
import {
  paymentStatusMeta,
  subscriptionStatusMeta,
} from "@/lib/domain-meta";
import { formatDate } from "@/lib/format";
import { mapAuditEventsToActivityItems } from "@/lib/workflow-activity";
import type {
  AuditEvent,
  Customer,
  Payment,
  Plan,
  Subscription,
  SubscriptionStatus,
} from "@/types/domain";

type SubscriptionStatusWorkbenchProps = {
  auditEvents: AuditEvent[];
  customers: Customer[];
  plans: Plan[];
  subscriptions: Subscription[];
  payments: Payment[];
};

type TransitionOption = {
  description: string;
  label: string;
  nextStatus: SubscriptionStatus;
};

const transitionOptions: Record<SubscriptionStatus, TransitionOption[]> = {
  active: [
    {
      nextStatus: "paused",
      label: "일시 중지",
      description: "다음 청구 전에 서비스 사용을 잠시 멈추고 후속 대응 여지를 남깁니다.",
    },
    {
      nextStatus: "scheduled_for_cancel",
      label: "해지 예약",
      description: "현재 청구 주기를 마친 뒤 자동으로 해지되도록 예약합니다.",
    },
  ],
  past_due: [
    {
      nextStatus: "active",
      label: "정상 복구",
      description: "수동 확인 후 구독을 다시 정상 상태로 전환합니다.",
    },
    {
      nextStatus: "paused",
      label: "일시 중지",
      description: "결제 문제를 해결할 때까지 사용을 잠시 중지합니다.",
    },
    {
      nextStatus: "scheduled_for_cancel",
      label: "해지 예약",
      description: "지속적인 결제 실패로 다음 청구 시점 종료를 예약합니다.",
    },
  ],
  paused: [
    {
      nextStatus: "active",
      label: "재개",
      description: "고객 요청 또는 운영 판단에 따라 구독을 다시 활성화합니다.",
    },
    {
      nextStatus: "scheduled_for_cancel",
      label: "해지 예약",
      description: "일시 중지 상태에서 종료를 확정하기 전에 예약 상태로 전환합니다.",
    },
  ],
  scheduled_for_cancel: [
    {
      nextStatus: "active",
      label: "예약 해지 취소",
      description: "고객 유지에 성공해 해지 예약을 풀고 정상 상태로 복구합니다.",
    },
    {
      nextStatus: "canceled",
      label: "즉시 해지",
      description: "다음 청구를 기다리지 않고 운영자가 즉시 해지 처리합니다.",
    },
  ],
  canceled: [
    {
      nextStatus: "active",
      label: "재활성화",
      description: "복귀 고객을 위해 기존 구독을 다시 활성 상태로 전환합니다.",
    },
  ],
};

export function SubscriptionStatusWorkbench({
  auditEvents,
  customers,
  plans,
  subscriptions,
  payments,
}: SubscriptionStatusWorkbenchProps) {
  const [localSubscriptions, setLocalSubscriptions] = useState(subscriptions);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(
    subscriptions[0]?.id ?? "",
  );
  const [nextStatus, setNextStatus] = useState<SubscriptionStatus | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [activityItems, setActivityItems] = useState(() =>
    mapAuditEventsToActivityItems(
      auditEvents.filter((event) => event.entityType === "subscription"),
    ),
  );

  const rows = localSubscriptions.map((subscription) => {
    const customer = customers.find((item) => item.id === subscription.customerId);
    const plan = plans.find((item) => item.id === subscription.planId);
    const latestPayment = payments
      .filter((item) => item.customerId === subscription.customerId)
      .toSorted((a, b) => b.attemptedAt.localeCompare(a.attemptedAt))[0];

    return {
      customer,
      latestPayment,
      plan,
      subscription,
    };
  });

  const selectedRow =
    rows.find((row) => row.subscription.id === selectedSubscriptionId) ?? rows[0] ?? null;

  const activeCount = localSubscriptions.filter(
    (item) => item.status === "active",
  ).length;
  const pastDueCount = localSubscriptions.filter(
    (item) => item.status === "past_due",
  ).length;
  const scheduledCancelCount = localSubscriptions.filter(
    (item) => item.status === "scheduled_for_cancel",
  ).length;

  function handleConfirmStatusChange() {
    if (!selectedRow || !nextStatus) {
      return;
    }

    const previousStatus = selectedRow.subscription.status;
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    const summary = `${selectedRow.customer?.name ?? "고객"}의 구독 상태를 ${
      subscriptionStatusMeta[previousStatus].label
    }에서 ${subscriptionStatusMeta[nextStatus].label}(으)로 변경했습니다.`;

    setLocalSubscriptions((current) =>
      current.map((subscription) =>
        subscription.id === selectedRow.subscription.id
          ? {
              ...subscription,
              status: nextStatus,
              cancelAt:
                nextStatus === "scheduled_for_cancel" || nextStatus === "canceled"
                  ? subscription.nextBillingDate ?? today
                  : null,
            }
          : subscription,
      ),
    );

    setFeedbackMessage(summary);
    setActivityItems((current) => [
      {
        id: `subscription-${selectedRow.subscription.id}-${now}`,
        occurredAt: now,
        summary,
        detail: `subscription · ${selectedRow.subscription.id}`,
      },
      ...current,
    ]);
    setNextStatus(null);
  }

  return (
    <main className="flex flex-col gap-10">
      <PageHeader
        eyebrow="관리자 운영"
        title="고객 구독 상태 변경"
        description="고객의 현재 구독 상태를 검토하고, 일시 중지나 해지 예약 같은 고위험 상태 변경을 확인 절차와 함께 처리하는 워크플로우입니다."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="활성 구독"
          value={`${activeCount}건`}
          description="정상 운영 중인 구독 건수입니다."
        />
        <StatCard
          label="결제 지연"
          value={`${pastDueCount}건`}
          description="후속 대응이 필요한 지연 상태의 구독 건수입니다."
        />
        <StatCard
          label="해지 예약"
          value={`${scheduledCancelCount}건`}
          description="유지 대응 여지가 남아 있는 예약 해지 건수입니다."
        />
      </section>

      {feedbackMessage ? <ActionFeedbackBanner message={feedbackMessage} /> : null}

      {rows.length > 0 ? (
        <TableShell
          title="고객 구독 목록"
          description="상태를 변경할 고객을 선택하면 아래에서 전환 가능한 상태와 확인 단계를 볼 수 있습니다."
          columns={["고객명", "플랜", "현재 상태", "최근 결제", "작업"]}
        >
          {rows.map((row) => {
            const subscriptionMeta = subscriptionStatusMeta[row.subscription.status];
            const paymentMeta = row.latestPayment
              ? paymentStatusMeta[row.latestPayment.status]
              : { label: "결제 없음", tone: "neutral" as const };

            return (
              <tr key={row.subscription.id} className="border-t border-slate-200">
                <td className="px-6 py-4 text-sm font-medium text-slate-950">
                  {row.customer ? (
                    <Link
                      href={`/admin/customers/${row.customer.id}`}
                      className="transition hover:text-slate-700 hover:underline"
                    >
                      {row.customer.name}
                    </Link>
                  ) : (
                    "미확인 고객"
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {row.plan?.name ?? "플랜 미정"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <StatusBadge
                    label={subscriptionMeta.label}
                    tone={subscriptionMeta.tone}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <StatusBadge
                    label={paymentMeta.label}
                    tone={paymentMeta.tone}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSubscriptionId(row.subscription.id);
                        setNextStatus(null);
                      }}
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      상태 변경
                    </button>
                    {row.customer ? (
                      <Link
                        href={`/admin/customers/${row.customer.id}`}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                      >
                        상세 보기
                      </Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </TableShell>
      ) : (
        <EmptyState
          title="표시할 구독이 없습니다"
          description="구독 데이터가 준비되면 이 화면에서 상태 변경 워크플로우를 진행할 수 있습니다."
        />
      )}

      {selectedRow ? (
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              선택된 고객
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {selectedRow.customer?.name ?? "이름 미확인"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {selectedRow.customer?.email ?? "이메일 미확인"}
            </p>
            {selectedRow.customer ? (
              <Link
                href={`/admin/customers/${selectedRow.customer.id}`}
                className="mt-4 inline-flex text-sm font-medium text-slate-700 transition hover:text-slate-950 hover:underline"
              >
                고객 상세 보기
              </Link>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <StatusBadge
                label={
                  subscriptionStatusMeta[selectedRow.subscription.status].label
                }
                tone={
                  subscriptionStatusMeta[selectedRow.subscription.status].tone
                }
              />
              {selectedRow.subscription.nextBillingDate ? (
                <StatusBadge
                  label={`다음 청구 ${formatDate(
                    selectedRow.subscription.nextBillingDate,
                  )}`}
                  tone="info"
                />
              ) : null}
            </div>

            <div className="mt-8 space-y-3">
              {transitionOptions[selectedRow.subscription.status].map((option) => (
                <button
                  key={option.nextStatus}
                  type="button"
                  onClick={() => setNextStatus(option.nextStatus)}
                  className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                    nextStatus === option.nextStatus
                      ? "border-slate-900 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="mt-2 text-sm leading-6 text-inherit">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              변경 확인
            </p>

            {nextStatus ? (
              <>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                  {subscriptionStatusMeta[nextStatus].label}로 변경
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  이 변경은 즉시 화면에 반영됩니다. 실제 서버 저장은 하지 않지만,
                  운영 제품처럼 확인 단계를 거친 뒤 처리되도록 구성했습니다.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <StatusBadge
                    label={`현재 ${
                      subscriptionStatusMeta[selectedRow.subscription.status].label
                    }`}
                    tone={
                      subscriptionStatusMeta[selectedRow.subscription.status].tone
                    }
                  />
                  <StatusBadge
                    label={`변경 후 ${subscriptionStatusMeta[nextStatus].label}`}
                    tone={subscriptionStatusMeta[nextStatus].tone}
                  />
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmStatusChange}
                    className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    변경 확인
                  </button>
                  <button
                    type="button"
                    onClick={() => setNextStatus(null)}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                왼쪽에서 전환할 상태를 먼저 선택하면, 여기에서 확인 후 변경할 수
                있습니다.
              </p>
            )}
          </article>
        </section>
      ) : null}

      <ActionActivityFeed
        title="구독 상태 변경 로그"
        description="목업 감사 이벤트와 이번 세션에서 처리한 상태 변경을 함께 보여줍니다."
        emptyTitle="아직 기록된 상태 변경이 없습니다"
        emptyDescription="구독 상태를 변경하면 여기에서 최근 처리 이력을 바로 확인할 수 있습니다."
        items={activityItems}
      />
    </main>
  );
}
