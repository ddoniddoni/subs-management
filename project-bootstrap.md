# Exec plan - project bootstrap

## Goal

Bootstrap a clean, portfolio-grade frontend repo for **Subscription Ops Console** so that feature work can begin immediately with a stable architectural base.

## Outcome

After this plan is complete, the repo should have:
- a working Next.js + TypeScript app
- strict lint/typecheck/test/build commands
- route skeletons for customer and admin areas
- foundational domain types and mock data
- shared layout, navigation, status badges, and table primitives
- documentation that makes future Codex tasks predictable

## Assumptions

- No existing production code needs to be preserved.
- Mock data is acceptable for v1 and preferred over waiting for backend integration.
- The admin surface is the main portfolio value, so architecture must support complex operations workflows early.
- A single consistent styling strategy will be chosen and used throughout.

## Scope

### In scope
- initialize project
- configure tooling and quality gates
- create base folder structure
- add route placeholders
- define key domain models and seed fixtures
- create initial shared UI primitives
- document decisions and follow-up tasks

### Out of scope
- real payment gateway integration
- production auth provider integration
- server persistence
- polished marketing animations
- advanced charts beyond initial believable placeholders

## Step-by-step implementation

### 1. Initialize the repo
- create app with Next.js App Router and TypeScript
- enable strict TypeScript settings
- choose package manager and install dependencies
- add standard scripts for dev, lint, typecheck, test, build

### 2. Establish project structure
Create the following directories if they do not exist:

```txt
src/app
src/features
src/components/ui
src/components/shared
src/lib
src/mocks
src/types
tests
docs/execplans
```

### 3. Add app skeleton and navigation
- customer routes: `/`, `/pricing`, `/checkout`, `/app/subscription`, `/app/billing`
- admin routes: `/admin`, `/admin/customers`, `/admin/payments`, `/admin/refunds`, `/admin/coupons`, `/admin/analytics`, `/admin/admin-users`, `/admin/audit-log`
- shared top-level layout
- admin sidebar navigation
- obvious page headings and empty placeholders

### 4. Define domain types and mock fixtures
Create shared types and mock data for:
- customer
- plan
- subscription
- payment/invoice
- refund
- coupon
- admin user
- audit event
- metric snapshot

Requirements:
- centralize status enums/constants
- include enough fixture variation to exercise filters and edge cases
- ensure relationships are believable

### 5. Build foundational reusable UI
Start with components that reduce future churn:
- page header
- stat card
- status badge
- data table shell
- filter bar shell
- empty state
- error state
- loading skeleton
- confirmation dialog shell

These should be reusable, not page-specific.

### 6. Add first-pass feature slices
Create placeholder feature modules:
- `features/customers`
- `features/subscriptions`
- `features/payments`
- `features/refunds`
- `features/coupons`
- `features/analytics`
- `features/admin-users`
- `features/audit-log`

Each slice should be able to own its types, mappers, config, and tests if needed.

### 7. Add quality tooling
- ESLint
- Prettier if desired, but only if the team chooses to use it consistently
- testing framework
- E2E framework for critical flows
- CI-friendly scripts

### 8. Add first validation tests
Minimum initial tests:
- one smoke test for route render or critical component render
- one domain formatter/util test
- one E2E placeholder spec that can grow later

### 9. Document the architecture
- keep `README.md` accurate
- update `AGENTS.md` if conventions evolve
- create additional exec plans before large feature areas

## Risks

### Risk: Overbuilding the bootstrap
Mitigation: keep route placeholders simple and save business complexity for feature iterations.

### Risk: UI system churn
Mitigation: choose one styling/component approach early and stick to it.

### Risk: Mock data becoming unrealistic
Mitigation: model explicit states and edge cases from the start.

### Risk: Too much focus on public pages
Mitigation: keep customer surface thin and reserve most complexity for admin workflows.

## Validation checklist

The bootstrap is complete when:
- app starts locally
- all planned routes render
- lint passes
- typecheck passes
- test command passes
- build succeeds
- mock data supports meaningful page placeholders
- docs match the actual repo structure

## Suggested follow-up exec plans

Create these next, one file per area:
- `docs/execplans/customer-surface-v1.md`
- `docs/execplans/admin-customer-workflows.md`
- `docs/execplans/payments-and-refunds.md`
- `docs/execplans/analytics-and-audit-log.md`
- `docs/execplans/testing-and-a11y-pass.md`
