# Bootstrap Step 20: Admin Data Composition

## Step Summary

관리자 상세 화면 snapshot builder에 반복되는 데이터 조합 로직을 공통화하는 단계다. 이번 목표는 새 기능 추가보다 다음 step에서 안전하게 확장할 수 있는 기반을 다지는 것이다.

## Why Now

- step 19까지 오면서 고객/결제/환불 상세 화면이 모두 route context와 cross-link를 갖추게 됐다.
- 이제 화면은 충분히 연결됐고, 내부 데이터 조합 로직의 중복을 줄일 타이밍이다.
- 다음 기능 확장 전에 공통 helper를 만들면 변경 비용과 회귀 위험을 낮출 수 있다.

## Intended Output

- 공통 admin detail composition helper 추가
- customer/payment/refund snapshot builder 간 중복 제거
- helper 또는 snapshot 조합 테스트 보강

## Non-Goals

- 새 관리자 화면 추가
- 데이터 소스 변경
- 라우트 구조 변경

## Validation Plan

- detail snapshot 관련 테스트 통과
- 전체 lint/typecheck/test/build 통과
