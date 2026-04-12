# Codex Handoff

## Snapshot

- Date: 2026-04-12
- Current branch: `step/19-admin-route-polish`
- Workspace status target: clean
- `develop` status: merged through `step/18-subscription-ops-hardening`
- step branch status: `step/19-admin-route-polish` is implemented, validated, and ready to push
- `origin/develop` still represents the post-step-18 baseline until step 19 is merged

## Completed Through Step 19

- `step 01`: route foundation
- `step 02`: layout navigation
- `step 03`: ui primitives
- `step 04`: domain types and mocks
- `step 05`: admin workflows
- `step 06`: customer detail
- `step 07`: audit log
- `step 08`: customer ops table
- `step 09`: refund detail
- `step 10`: payment detail
- `step 11`: coupon operations
- `step 12`: analytics dashboard
- `step 13`: admin access control
- `step 14`: customer acquisition flow
- `step 15`: customer account center
- `step 16`: admin command center
- `step 17`: subscription ops workbench
- `step 18`: subscription ops hardening
- `step 19`: admin route polish

## Step 19 Summary

Polished admin route flow so customer, payment, refund, and subscription surfaces now share a common route-context header and deeper cross-links.

Key files:

- `docs/execplans/step-19-admin-route-polish.md`
- `docs/steps/bootstrap-step-19-admin-route-polish.md`
- `src/components/shared/admin-route-header.tsx`
- `src/lib/admin-routes.ts`
- `src/app/(admin)/admin/subscriptions/page.tsx`
- `src/features/admin-home/lib/admin-command-center.ts`
- `src/features/customers/components/customer-detail-view.tsx`
- `src/features/customers/components/subscription-status-workbench.tsx`
- `src/features/payments/components/payment-detail-view.tsx`
- `src/features/refunds/components/refund-detail-view.tsx`
- `tests/admin-command-center.test.tsx`
- `tests/customer-detail.test.tsx`
- `tests/payment-detail.test.tsx`
- `tests/refund-detail.test.tsx`
- `tests/subscription-status-workbench.test.tsx`

Included changes:

- added a shared admin route header with breadcrumb and quick-link support
- wired customer, payment, and refund detail pages into the shared route context pattern
- added focused subscription workbench entry with `/admin/subscriptions?focus=<id>`
- updated command center watchlist links to open a focused subscription from scheduled-cancel items
- expanded tests to cover breadcrumbs, quick links, and cross-route entry behavior

Validation completed for step 19:

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`

Relevant commits:

- `fc73be9` `feat(admin): add subscription ops workbench`
- `b9bb1a3` `docs(repo): add codex handoff`
- `ae5b43a` `feat(admin): harden subscription ops workbench`
- step 19 commit can be read from `git log --oneline --decorate -6` on this branch

## Remote Status

- `origin/develop` includes step 18, not step 19 yet
- `origin/step/17-subscription-ops-workbench` already contains the step 17 branch history
- `origin/step/18-subscription-ops-hardening` contains the previous step history
- `origin/step/19-admin-route-polish` should be pushed after the current commit

## Resume Checklist

1. `Get-Content AGENTS.md`
2. `Get-Content docs/codex-handoff.md`
3. `Get-Content docs/context-handoff.md`
4. `git branch --show-current`
5. `git status --short`
6. `git log --oneline --decorate -6`

## Next Move When Resuming

If continuing with a new step:

1. merge `step/19-admin-route-polish` into latest `develop`
2. create both planning docs before implementation
3. branch `step/20-<slug>` from updated `develop`
4. implement, validate, commit, and push
