# Context Handoff

## 목적
이 문서는 컨텍스트가 초기화되거나 새 세션에서 작업을 이어갈 때, 현재 진행 상태와 작업 규칙을 빠르게 복구하기 위한 handoff 문서입니다.

## 현재 스냅샷
- 작성 기준일: 2026-04-11
- 현재 브랜치: `step/16-admin-command-center`
- 현재 워킹트리: clean
- 현재 `develop` 반영 상태: `step/15-customer-account-center`까지 머지 완료
- 현재 원격 반영 상태:
  - `origin/develop` -> `merge(step-15): integrate customer account center`
  - `origin/step/16-admin-command-center` -> `feat(admin): build command center`

## 현재까지 완료된 step
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

## step 16 요약
`/admin` 홈을 운영자용 커맨드 센터로 교체했습니다.

핵심 구현 파일:
- `docs/execplans/step-16-admin-command-center.md`
- `docs/steps/bootstrap-step-16-admin-command-center.md`
- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin)/admin/loading.tsx`
- `src/features/admin-home/lib/admin-command-center.ts`
- `src/features/admin-home/components/admin-command-center-view.tsx`
- `tests/admin-command-center.test.tsx`

포함된 기능:
- 우선 처리 큐
- 빠른 진입 카드
- 운영 watchlist
- 최근 운영 활동 feed
- admin 홈 loading 상태

검증 결과:
- `npm.cmd run lint` 통과
- `npm.cmd run typecheck` 통과
- `npm.cmd run test` 통과
- `npm.cmd run build` 통과

step 16 커밋:
- `feat(admin): build command center`
- commit: `ae79387`

## 다음 컨텍스트에서 바로 해야 할 일
다음 step으로 넘어갈 때는 반드시 아래 순서를 지킵니다.

1. `step/16-admin-command-center`를 `develop`에 머지
2. 원격 `develop` 푸시
3. 최신 `develop`에서 새 브랜치 생성
   - 예: `step/17-<slug>`
4. 구현 전에 계획서 2종 먼저 생성
   - `docs/execplans/step-17-<slug>.md`
   - `docs/steps/bootstrap-step-17-<slug>.md`
5. 그 다음 구현
6. 아래 검증 4종 실행
   - `npm.cmd run lint`
   - `npm.cmd run typecheck`
   - `npm.cmd run test`
   - `npm.cmd run build`
7. Conventional Commit으로 커밋
8. step 브랜치 원격 푸시

## 작업 방식 요약
상세 규칙은 루트 `AGENTS.md`를 기준으로 합니다. 특히 아래를 반드시 지킵니다.

- step 작업은 항상 `step/NN-<slug>` 브랜치 단위로 진행
- 새 step 시작 전, 직전 step 브랜치를 먼저 `develop`에 머지
- 계획서 2종을 먼저 만들고 구현 시작
- PowerShell에서는 `npm` 대신 `npm.cmd` 사용
- 커밋 메시지는 Conventional Commits 형식 사용
- 문서/테스트/타입/빌드까지 포함해서 마무리
- `docs/steps` 파일 누락 없이 맞춰서 생성

## 다음 세션 복구 체크리스트
새 컨텍스트가 시작되면 아래 순서로 상태를 확인하면 됩니다.

1. `Get-Content AGENTS.md`
2. `Get-Content docs/context-handoff.md`
3. `git branch --show-current`
4. `git status --short`
5. `git log --oneline --decorate -6`
6. `Get-ChildItem docs/steps | Select-Object Name`

## 참고
- `docs/steps`에는 `step 01`부터 `step 16`까지 bootstrap 문서가 존재합니다.
- `docs/execplans`에는 `step 05`부터 `step 16`까지 실행 계획 문서가 존재합니다.
- 이 문서는 다음 handoff 시점마다 최신 상태로 갱신합니다.
