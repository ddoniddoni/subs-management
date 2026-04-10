import { couponStatusMeta } from "@/lib/domain-meta";
import { formatCurrency } from "@/lib/format";
import { coupons } from "@/mocks/subscription-data";
import type { BillingInterval, Plan, PlanCode } from "@/types/domain";

const annualBillingMultiplier = 10;

type PlanMeta = {
  accent: "teal" | "amber" | "slate";
  audienceLabel: string;
  badgeLabel: string;
  extraSeatPrice: number;
  recommended: boolean;
  highlightFeatures: string[];
  comparisonValues: {
    renewals: string;
    billing: string;
    support: string;
    governance: string;
    seats: string;
  };
};

export type AcquisitionPlan = {
  id: string;
  code: PlanCode;
  name: string;
  description: string;
  seatsIncluded: number;
  audienceLabel: string;
  badgeLabel: string;
  accent: "teal" | "amber" | "slate";
  recommended: boolean;
  highlightFeatures: string[];
  monthlyPrice: number;
  annualPrice: number;
  annualSavings: number;
  extraSeatPrice: number;
  comparisonValues: PlanMeta["comparisonValues"];
  checkoutHref: string;
};

export type CustomerAcquisitionSnapshot = {
  heroMetrics: {
    label: string;
    value: string;
    description: string;
  }[];
  valuePillars: {
    title: string;
    description: string;
  }[];
  launchSteps: {
    title: string;
    description: string;
  }[];
  faqItems: {
    question: string;
    answer: string;
  }[];
  planCatalog: AcquisitionPlan[];
  comparisonRows: {
    feature: string;
    values: Record<PlanCode, string>;
  }[];
};

export type CheckoutFormValues = {
  planCode: PlanCode;
  billingInterval: BillingInterval;
  seats: number;
  name: string;
  email: string;
  company: string;
  couponCode: string;
};

export type CheckoutSummary = {
  selectedPlan: AcquisitionPlan;
  billingLabel: string;
  includedSeatsLabel: string;
  baseAmount: number;
  extraSeatCount: number;
  extraSeatAmount: number;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  couponMessage: string | null;
};

const planMeta: Record<PlanCode, PlanMeta> = {
  starter: {
    accent: "slate",
    audienceLabel: "도입 팀 시작",
    badgeLabel: "빠른 셋업",
    extraSeatPrice: 6000,
    recommended: false,
    highlightFeatures: [
      "월 단위 구독 시작",
      "기본 청구 이력 제공",
      "운영팀 없이도 빠른 도입",
    ],
    comparisonValues: {
      renewals: "기본 자동 결제",
      billing: "최근 3개월 청구 이력",
      support: "업무일 이메일 지원",
      governance: "기본 활동 기록",
      seats: "3석 포함",
    },
  },
  pro: {
    accent: "teal",
    audienceLabel: "성장팀 표준 운영",
    badgeLabel: "추천 플랜",
    extraSeatPrice: 5000,
    recommended: true,
    highlightFeatures: [
      "결제 실패 알림과 재시도",
      "셀프서비스 청구 확인",
      "환불 대응이 필요한 팀에 적합",
    ],
    comparisonValues: {
      renewals: "자동 결제 + 실패 알림",
      billing: "전체 결제/환불 이력",
      support: "영업일 내 우선 응답",
      governance: "운영자 이력 공유",
      seats: "10석 포함",
    },
  },
  team: {
    accent: "amber",
    audienceLabel: "확장 조직 운영",
    badgeLabel: "확장형",
    extraSeatPrice: 3500,
    recommended: false,
    highlightFeatures: [
      "여러 담당자 좌석 확장",
      "재무/운영 협업에 적합",
      "감사 가능 운영 흐름 대비",
    ],
    comparisonValues: {
      renewals: "대량 결제 운영 최적화",
      billing: "세부 청구 분석",
      support: "운영 온보딩 지원",
      governance: "감사 로그 기반 관리",
      seats: "30석 포함",
    },
  },
};

export function getCustomerAcquisitionSnapshot(plans: Plan[]) {
  const planCatalog = plans.map((plan) => {
    const meta = planMeta[plan.code];

    return {
      id: plan.id,
      code: plan.code,
      name: plan.name,
      description: plan.description,
      seatsIncluded: plan.seatsIncluded,
      audienceLabel: meta.audienceLabel,
      badgeLabel: meta.badgeLabel,
      accent: meta.accent,
      recommended: meta.recommended,
      highlightFeatures: meta.highlightFeatures,
      monthlyPrice: plan.price,
      annualPrice: plan.price * annualBillingMultiplier,
      annualSavings: plan.price * 2,
      extraSeatPrice: meta.extraSeatPrice,
      comparisonValues: meta.comparisonValues,
      checkoutHref: `/checkout?plan=${plan.code}`,
    } satisfies AcquisitionPlan;
  });

  return {
    heroMetrics: [
      {
        label: "자동 갱신 안정성",
        value: "99.3%",
        description: "목업 운영 기준 결제 실패 재대응 흐름까지 포함한 갱신 유지율입니다.",
      },
      {
        label: "지원 리드타임",
        value: "4시간",
        description: "결제/환불 이슈가 운영 큐에 반영되기까지의 평균 대응 시작 시간입니다.",
      },
      {
        label: "도입 완료 시간",
        value: "1일",
        description: "플랜 선택부터 첫 청구 이력 확인까지 걸리는 평균 온보딩 시간입니다.",
      },
    ],
    valuePillars: [
      {
        title: "운영팀이 안심하는 결제 흐름",
        description: "고객은 결제를 마치고, 운영자는 실패 결제와 환불 이력을 같은 제품 안에서 안전하게 추적합니다.",
      },
      {
        title: "처음부터 청구 이력이 정리되는 구조",
        description: "체크아웃 이후 곧바로 내 구독과 결제 내역으로 이어져, 고객 문의 대응도 짧아집니다.",
      },
      {
        title: "성장 단계에 맞는 좌석 확장",
        description: "작게 시작하더라도 좌석 추가와 운영 수준을 함께 확장할 수 있도록 플랜을 설계했습니다.",
      },
    ],
    launchSteps: [
      {
        title: "1. 플랜 선택",
        description: "월간 또는 연간 결제 주기를 비교하고 팀 규모에 맞는 시작 플랜을 정합니다.",
      },
      {
        title: "2. 워크스페이스 설정",
        description: "담당자 정보와 회사명을 입력하고 필요한 좌석 수를 선택합니다.",
      },
      {
        title: "3. 첫 청구 확인",
        description: "주문 완료 후 곧바로 내 구독과 결제 내역에서 활성 상태를 확인합니다.",
      },
    ],
    faqItems: [
      {
        question: "결제 실패가 나면 어떻게 처리되나요?",
        answer: "프로 이상 플랜에서는 실패 결제가 운영 큐에 반영되고, 관리자가 재시도나 환불 대응을 진행할 수 있습니다.",
      },
      {
        question: "연간 결제로 전환하면 어떤 혜택이 있나요?",
        answer: "월 10개월 요금만 청구되는 구조로 계산해 2개월 분을 절감하도록 구성했습니다.",
      },
      {
        question: "쿠폰은 checkout에서 바로 반영되나요?",
        answer: "활성 상태인 프로모션 코드를 입력하면 주문 요약에 즉시 할인 금액이 반영됩니다.",
      },
    ],
    planCatalog,
    comparisonRows: [
      {
        feature: "자동 갱신 / 결제 대응",
        values: {
          starter: planMeta.starter.comparisonValues.renewals,
          pro: planMeta.pro.comparisonValues.renewals,
          team: planMeta.team.comparisonValues.renewals,
        },
      },
      {
        feature: "청구 / 결제 내역",
        values: {
          starter: planMeta.starter.comparisonValues.billing,
          pro: planMeta.pro.comparisonValues.billing,
          team: planMeta.team.comparisonValues.billing,
        },
      },
      {
        feature: "지원 수준",
        values: {
          starter: planMeta.starter.comparisonValues.support,
          pro: planMeta.pro.comparisonValues.support,
          team: planMeta.team.comparisonValues.support,
        },
      },
      {
        feature: "운영 거버넌스",
        values: {
          starter: planMeta.starter.comparisonValues.governance,
          pro: planMeta.pro.comparisonValues.governance,
          team: planMeta.team.comparisonValues.governance,
        },
      },
      {
        feature: "기본 좌석",
        values: {
          starter: planMeta.starter.comparisonValues.seats,
          pro: planMeta.pro.comparisonValues.seats,
          team: planMeta.team.comparisonValues.seats,
        },
      },
    ],
  } satisfies CustomerAcquisitionSnapshot;
}

export function resolveCatalogPlan(
  planCatalog: AcquisitionPlan[],
  requestedPlanCode?: string | null,
) {
  return (
    planCatalog.find((plan) => plan.code === requestedPlanCode) ??
    planCatalog.find((plan) => plan.recommended) ??
    planCatalog[0] ??
    null
  );
}

export function getCheckoutDefaultValues(
  planCatalog: AcquisitionPlan[],
  requestedPlanCode?: string | null,
): CheckoutFormValues | null {
  const selectedPlan = resolveCatalogPlan(planCatalog, requestedPlanCode);

  if (!selectedPlan) {
    return null;
  }

  return {
    planCode: selectedPlan.code,
    billingInterval: "monthly",
    seats: selectedPlan.seatsIncluded,
    name: "",
    email: "",
    company: "",
    couponCode: "",
  };
}

export function getCheckoutSummary(
  planCatalog: AcquisitionPlan[],
  values: CheckoutFormValues,
): CheckoutSummary | null {
  const selectedPlan = resolveCatalogPlan(planCatalog, values.planCode);

  if (!selectedPlan) {
    return null;
  }

  const billingMultiplier =
    values.billingInterval === "annual" ? annualBillingMultiplier : 1;
  const baseAmount =
    values.billingInterval === "annual"
      ? selectedPlan.annualPrice
      : selectedPlan.monthlyPrice;
  const extraSeatCount = Math.max(values.seats - selectedPlan.seatsIncluded, 0);
  const extraSeatAmount =
    extraSeatCount * selectedPlan.extraSeatPrice * billingMultiplier;
  const subtotalAmount = baseAmount + extraSeatAmount;
  const couponCode = values.couponCode.trim().toUpperCase();
  const discountAmount = getDiscountAmount(subtotalAmount, couponCode);
  const couponMessage = getCouponMessage(couponCode, discountAmount);

  return {
    selectedPlan,
    billingLabel: values.billingInterval === "monthly" ? "월간 결제" : "연간 결제",
    includedSeatsLabel: `${selectedPlan.seatsIncluded}석 포함`,
    baseAmount,
    extraSeatCount,
    extraSeatAmount,
    subtotalAmount,
    discountAmount,
    totalAmount: Math.max(subtotalAmount - discountAmount, 0),
    couponMessage,
  };
}

export function validateCheckoutForm(
  planCatalog: AcquisitionPlan[],
  values: CheckoutFormValues,
) {
  const errors: string[] = [];
  const summary = getCheckoutSummary(planCatalog, values);

  if (!summary) {
    errors.push("선택한 플랜을 확인할 수 없습니다.");
  }

  if (values.name.trim().length < 2) {
    errors.push("담당자 이름을 2자 이상 입력해 주세요.");
  }

  if (!values.email.includes("@")) {
    errors.push("알림을 받을 이메일 주소를 정확히 입력해 주세요.");
  }

  if (values.company.trim().length < 2) {
    errors.push("회사명을 입력해 주세요.");
  }

  if (values.seats < 1) {
    errors.push("좌석 수는 최소 1석 이상이어야 합니다.");
  }

  if (
    values.couponCode.trim().length > 0 &&
    getDiscountAmount(summary?.subtotalAmount ?? 0, values.couponCode.trim().toUpperCase()) === 0
  ) {
    errors.push("지원하지 않는 프로모션 코드입니다.");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function formatBillingPrice(plan: AcquisitionPlan, billingInterval: BillingInterval) {
  return formatCurrency(
    billingInterval === "monthly" ? plan.monthlyPrice : plan.annualPrice,
  );
}

export function getPlanAccentClasses(accent: AcquisitionPlan["accent"]) {
  if (accent === "teal") {
    return "border-teal-300 bg-teal-50 text-teal-900";
  }

  if (accent === "amber") {
    return "border-amber-300 bg-amber-50 text-amber-900";
  }

  return "border-slate-300 bg-slate-100 text-slate-900";
}

function getDiscountAmount(subtotalAmount: number, couponCode: string) {
  const coupon = coupons.find(
    (item) => item.code === couponCode && item.status === "active",
  );

  if (!coupon) {
    return 0;
  }

  if (coupon.discountType === "percent") {
    return Math.floor((subtotalAmount * coupon.discountValue) / 100);
  }

  return coupon.discountValue;
}

function getCouponMessage(couponCode: string, discountAmount: number) {
  if (couponCode.length === 0) {
    return null;
  }

  const coupon = coupons.find((item) => item.code === couponCode);

  if (!coupon) {
    return "등록되지 않은 프로모션 코드입니다.";
  }

  if (coupon.status !== "active") {
    return `${coupon.code} 코드는 현재 ${couponStatusMeta[coupon.status].label} 상태입니다.`;
  }

  return `${coupon.code} 코드가 적용되어 ${formatCurrency(discountAmount)} 할인됩니다.`;
}
