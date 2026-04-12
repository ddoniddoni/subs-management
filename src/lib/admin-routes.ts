export function getAdminSubscriptionsHref(focusSubscriptionId?: string | null) {
  if (!focusSubscriptionId) {
    return "/admin/subscriptions";
  }

  const searchParams = new URLSearchParams({
    focus: focusSubscriptionId,
  });

  return `/admin/subscriptions?${searchParams.toString()}`;
}
