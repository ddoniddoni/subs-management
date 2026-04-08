# Codex kickoff prompt - bootstrap the repo

Use this prompt as the first substantial Codex task after the repo is initialized.

---

You are working in a portfolio project called **Subscription Ops Console**.
Before making changes, read `AGENTS.md`, `README.md`, and `docs/project-bootstrap.md` and follow them.

## Objective

Bootstrap the project foundation for a realistic subscription product with:

- customer-facing pages (20-30%)
- admin operations dashboard (70-80%)

## Requirements

1. Set up a clean Next.js App Router + TypeScript structure if not already present.
2. Ensure the repo supports these commands:
   - `npm dev`
   - `npm lint`
   - `npm typecheck`
   - `npm test`
   - `npm build`
3. Create route skeletons for:
   - `/`
   - `/pricing`
   - `/checkout`
   - `/app/subscription`
   - `/app/billing`
   - `/admin`
   - `/admin/customers`
   - `/admin/payments`
   - `/admin/refunds`
   - `/admin/coupons`
   - `/admin/analytics`
   - `/admin/admin-users`
   - `/admin/audit-log`
4. Create initial shared layout and navigation, including a distinct admin layout.
5. Add foundational reusable UI primitives:
   - page header
   - status badge
   - stat card
   - empty state
   - error state
   - loading skeleton
   - table shell
6. Define core domain types and seed mock data for customers, subscriptions, payments, refunds, coupons, admin users, audit events, and metric snapshots.
7. Keep all async and placeholder screens ready for loading/empty/error/success states.
8. Keep TypeScript strict and avoid `any`.

## Constraints

- Do not integrate real payments or backend auth.
- Prefer believable mock data over empty shells.
- Keep the customer surface thin; reserve depth for admin workflows.
- Reuse components instead of duplicating layout code.
- Use a single styling approach consistently.

## Deliverables

- working route skeletons
- initial reusable UI components
- domain types and mock fixtures
- passing lint/typecheck/test/build if possible
- updated docs if the actual structure differs from the docs

## Output format

At the end, summarize:

- what was added
- any assumptions made
- commands run and results
- remaining follow-up tasks

---
