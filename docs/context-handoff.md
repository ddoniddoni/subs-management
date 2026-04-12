# Context Handoff

## 목적

다음 세션에서 현재 진행 상태와 step 작업 규칙을 빠르게 복구하기 위한 handoff 문서입니다.

## 현재 상태

- 작성 기준일: 2026-04-12
- 현재 브랜치: `step/19-admin-route-polish`
- 현재 작업 트리 목표 상태: clean
- `develop` 반영 상태:
  - `step/18-subscription-ops-hardening`까지 머지 완료
  - 현재 `develop`은 `step/19-admin-route-polish` 시작 기준점입니다.
- step 브랜치 상태:
  - `step/19-admin-route-polish` 구현 및 검증 완료
  - 아직 `develop`에는 머지되지 않았고, step 브랜치 기준으로 handoff를 남깁니다.

## 완료된 step

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

## step 19 요약

관리자 상세 라우트와 구독 운영 워크벤치 사이 이동 경험을 공통 패턴으로 정리했습니다. breadcrumb, quick link, focused subscription 진입 흐름을 추가해 고객/결제/환불/구독 화면을 더 자연스럽게 오갈 수 있게 했습니다.

추가/수정된 주요 파일:

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

포함된 변경:

- 관리자 상세 화면 상단에 breadcrumb와 관련 이동 quick link를 공통 컴포넌트로 적용
- 고객/결제/환불 상세에서 구독 워크벤치로 바로 들어가는 focused subscription 링크 추가
- `/admin/subscriptions?focus=<subscriptionId>` 진입 시 해당 구독을 바로 선택하도록 지원
- command center watchlist의 취소 예정 항목을 focused subscription 링크로 연결
- 관련 테스트에서 breadcrumb, quick link, focused entry 흐름 검증

검증 결과:

- `npm.cmd run lint` 통과
- `npm.cmd run typecheck` 통과
- `npm.cmd run test` 통과
- `npm.cmd run build` 통과

관련 커밋:

- step 17 관련:
  - `fc73be9` `feat(admin): add subscription ops workbench`
  - `b9bb1a3` `docs(repo): add codex handoff`
- step 18 관련:
  - `ae5b43a` `feat(admin): harden subscription ops workbench`
- step 19 관련:
  - 현재 브랜치의 최신 커밋에서 확인 가능

## 다음 세션에서 바로 할 일

다음 step으로 넘어갈 때는 아래 순서를 따르면 됩니다.

1. 현재 `step/19-admin-route-polish`를 `develop`에 머지
2. 원격 `develop` 푸시
3. 최신 `develop`에서 새 브랜치 생성
   - 예: `step/20-<slug>`
2. 구현 전에 문서 2종 먼저 생성
   - `docs/execplans/step-20-<slug>.md`
   - `docs/steps/bootstrap-step-20-<slug>.md`
4. 구현
5. 아래 검증 4종 실행
   - `npm.cmd run lint`
   - `npm.cmd run typecheck`
   - `npm.cmd run test`
   - `npm.cmd run build`
6. Conventional Commit으로 커밋
7. step 브랜치 원격 푸시

## 작업 방식 요약

- step 작업은 항상 `step/NN-<slug>` 브랜치 단위로 진행
- 새 step 시작 전 직전 step이 `develop`에 반영되어 있어야 함
- 계획 문서 2종을 먼저 작성하고 구현 시작
- PowerShell에서는 `npm.cmd` 사용
- 커밋 메시지는 Conventional Commits 사용
- 문서 / 테스트 / 빌드 검증까지 포함해 마무리

## 다음 세션 복구 체크리스트

1. `Get-Content AGENTS.md`
2. `Get-Content docs/context-handoff.md`
3. `Get-Content docs/codex-handoff.md`
4. `git branch --show-current`
5. `git status --short`
6. `git log --oneline --decorate -6`

## 참고

- `docs/steps`에는 step 01부터 step 19까지 bootstrap 문서가 있습니다.
- `docs/execplans`에는 step 05부터 step 19까지 실행 계획 문서가 있습니다.
- 다음 handoff 시점마다 이 문서를 최신 상태로 갱신합니다.
