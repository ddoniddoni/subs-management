# Screen Map - Subscription Ops Console

This document defines the initial screen inventory for the **TeamFit / Subscription Ops Console** portfolio project.

The purpose of this file is to help implementation stay consistent across README, exec plans, and Codex tasks.

---

## Public / customer-facing

### 1. Landing page `/`
**Purpose**
- explain the fictional subscription service quickly
- establish the business context for the admin console
- push users toward plan selection

**Sections**
- hero
- benefit/value section
- plan teaser cards
- FAQ preview
- CTA to pricing

**Notes**
- keep this page intentionally light
- do not over-invest in decorative marketing polish early

---

### 2. Pricing page `/pricing`
**Purpose**
- compare plans clearly
- communicate price, billing cycle, and feature differences

**Key UI**
- pricing cards
- billing cycle labels
- feature comparison list
- CTA per plan

---

### 3. Checkout page `/checkout`
**Purpose**
- simulate the subscription purchase flow

**Key UI**
- selected plan summary
- customer info form
- mock payment method form
- order summary
- success state

**Notes**
- real payment integration is not required for v1
- this flow exists mainly to support the rest of the product story

---

### 4. My Subscription `/app/subscription`
**Purpose**
- show current plan and subscription status

**Key UI**
- current plan card
- status badge
- renewal / expiration information
- plan metadata
- optional recent activity summary

---

### 5. Billing History `/app/billing`
**Purpose**
- show invoices and payment attempts clearly

**Key UI**
- billing table
- invoice number
- amount / date
- payment status badge
- failed or refunded indicators

---

## Admin / operations dashboard

### 6. Admin Home `/admin`
**Purpose**
- provide a quick operational summary for internal users

**Key UI**
- KPI cards
- revenue / MRR chart
- failed payment summary
- refund queue summary
- recent activity or alerts

---

### 7. Customers List `/admin/customers`
**Purpose**
- support fast customer lookup and filtering

**Key UI**
- search input
- status filter
- plan filter
- sortable table
- pagination

**Suggested columns**
- customer name
- email
- plan
- subscription status
- next billing date
- latest payment status

---

### 8. Customer Detail `/admin/customers/[customerId]`
**Purpose**
- provide a complete operational view of one customer

**Sections**
- customer profile summary
- subscription summary
- billing history
- refunds history
- coupon history
- audit timeline

**Important actions**
- pause subscription
- resume subscription
- cancel subscription
- issue coupon
- start refund review flow

---

### 9. Payments `/admin/payments`
**Purpose**
- inspect payment health and act on failures

**Key UI**
- status filters
- failed payment section
- retry action with confirmation
- payment detail drawer/modal
- links back to customer detail

---

### 10. Refunds `/admin/refunds`
**Purpose**
- process refund requests safely

**Key UI**
- requested / approved / rejected views or filters
- request detail panel
- approve action
- reject action with reason
- audit entry after decision

---

### 11. Coupons `/admin/coupons`
**Purpose**
- manage discounts, retention offers, and compensation

**Key UI**
- coupon list
- issue coupon modal
- revoke coupon action
- status and expiration filters

---

### 12. Analytics `/admin/analytics`
**Purpose**
- make trends visible for operations and support decision-making

**Key UI**
- MRR / revenue trend
- active subscriptions trend
- churn summary
- failed payment rate
- refund rate

**Notes**
- charts should support decisions, not decoration

---

### 13. Admin Users `/admin/admin-users`
**Purpose**
- show role visibility and access boundaries

**Key UI**
- admin list
- role badges
- permission summary
- read-only access view is acceptable for v1

---

### 14. Audit Log `/admin/audit-log`
**Purpose**
- make critical operational changes traceable

**Key UI**
- filters for actor, event type, date
- table or timeline
- links back to affected resource

**Example events**
- subscription paused
- subscription canceled
- refund approved
- coupon issued
- payment retried

---

## Reusable components to prioritize early

- `AppShell`
- `AdminSidebar`
- `Topbar`
- `PageHeader`
- `StatCard`
- `StatusBadge`
- `DataTable`
- `FilterBar`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`
- `ConfirmDialog`
- `ActivityTimeline`
