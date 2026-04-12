# Step 20 Execplan: Admin Data Composition

## Goal

고객/결제/환불 상세 화면에서 반복되는 snapshot 조합 로직을 공통 helper로 모아 유지보수성을 높인다.

## Assumptions

- `develop`에는 `step/19-admin-route-polish`까지 반영되어 있다.
- 관리자 상세 화면 3종은 모두 mock 기반 snapshot builder를 통해 데이터를 조합한다.
- 현재 중복되는 로직은 subscription + plan 결합, 관련 엔티티 정렬, 감사 이벤트 actor label 조합 쪽에 많다.

## Scope

- 관리자 상세 화면용 공통 composition helper를 추가한다.
- `customer-detail`, `payment-detail`, `refund-detail` snapshot builder를 helper 기반으로 정리한다.
- helper 동작을 검증하는 테스트를 추가하거나 기존 테스트를 보강한다.
- 동작 변화 없이 기존 화면 결과를 유지한다.

## Implementation Steps

1. 공통 admin detail composition helper 설계
2. 고객/결제/환불 snapshot builder에서 중복 로직 제거
3. helper 테스트 및 기존 snapshot 테스트 보강
4. lint, typecheck, test, build 검증

## Risks

- 리팩터링 과정에서 정렬 기준이나 actor label 형식이 바뀌면 화면/테스트가 미세하게 깨질 수 있다.
- 지나친 일반화로 helper 가독성이 떨어질 수 있다.

## Verification

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`
