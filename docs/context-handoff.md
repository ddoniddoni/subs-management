# Context Handoff

## 목적

다음 세션에서 현재 진행 상태와 step 작업 규칙을 빠르게 복구하기 위한 handoff 문서입니다.

## 현재 상태

- 작성 기준일: 2026-04-11
- 현재 브랜치: `develop`
- 현재 작업 트리 목표 상태: clean
- `develop` 반영 상태:
  - `step/17-subscription-ops-workbench`까지 머지 완료
  - 현재 `develop`은 다음 step 시작 기준점입니다.

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

## step 17 요약

`/admin/subscriptions` 전용 운영 화면을 추가하고, `/admin/customers`를 고객 탐색 테이블로 정상화했습니다.

추가/수정된 주요 파일:

- `docs/execplans/step-17-subscription-ops-workbench.md`
- `docs/steps/bootstrap-step-17-subscription-ops-workbench.md`
- `src/app/(admin)/admin/customers/page.tsx`
- `src/app/(admin)/admin/subscriptions/page.tsx`
- `src/app/(admin)/admin/subscriptions/loading.tsx`
- `src/features/customers/components/customer-ops-table-view.tsx`
- `src/features/admin-users/lib/admin-access.ts`
- `src/features/admin-home/lib/admin-command-center.ts`
- `src/lib/navigation.ts`
- `tests/customer-ops-table-view.test.tsx`
- `tests/admin-access.test.tsx`

포함된 변경:

- 관리자 내비게이션에 subscriptions 추가
- 관리자 권한 정책에 `/admin/subscriptions` 반영
- 구독 상태 변경 워크벤치를 `/admin/subscriptions`로 이동
- 고객 목록에서 검색 / 필터 / 정렬 / 페이지네이션 복구
- command center에서 구독 운영 라우트로 연결 갱신

검증 결과:

- `npm.cmd run lint` 통과
- `npm.cmd run typecheck` 통과
- `npm.cmd run test` 통과
- `npm.cmd run build` 통과

관련 커밋:

- `fc73be9` `feat(admin): add subscription ops workbench`
- `b9bb1a3` `docs(repo): add codex handoff`

## 다음 세션에서 바로 할 일

다음 step으로 넘어갈 때는 아래 순서를 따르면 됩니다.

1. 최신 `develop`에서 새 브랜치 생성
   - 예: `step/18-<slug>`
2. 구현 전에 문서 2종 먼저 생성
   - `docs/execplans/step-18-<slug>.md`
   - `docs/steps/bootstrap-step-18-<slug>.md`
3. 구현
4. 아래 검증 4종 실행
   - `npm.cmd run lint`
   - `npm.cmd run typecheck`
   - `npm.cmd run test`
   - `npm.cmd run build`
5. Conventional Commit으로 커밋
6. step 브랜치 원격 푸시

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

- `docs/steps`에는 step 01부터 step 17까지 bootstrap 문서가 있습니다.
- `docs/execplans`에는 step 05부터 step 17까지 실행 계획 문서가 있습니다.
- 다음 handoff 시점마다 이 문서를 최신 상태로 갱신합니다.
