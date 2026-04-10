# 실행 계획 - Bootstrap Step 17 구독 운영 워크벤치

## 목표

step 16에서 관리자 홈을 command center로 정리한 뒤, 필수 운영 화면 중 비어 있는 `/admin/subscriptions`를 채운다. 동시에 현재 `/admin/customers`에 잘못 연결된 구독 상태 워크벤치를 분리해 고객 목록과 구독 운영 플로우의 책임을 다시 정돈한다.

## 이번 단계에서 할 일

- `/admin/subscriptions` 라우트 추가
- 구독 상태 운영 화면 연결
- `/admin/customers` 고객 목록 화면 복구
- 관리자 내비게이션에 구독 메뉴 추가
- 관리자 권한 정책 및 테스트 갱신
- loading 상태와 handoff 문서 업데이트

## 이번 단계에서 하지 않을 일

- 실제 API 연동
- 서버 액션 기반 상태 저장
- 대용량 테이블 가상화
- 벌크 구독 상태 변경
- E2E 테스트 도입

## 대상 화면

### 1. `/admin/customers`
- 고객 검색
- 상태 필터
- 플랜 필터
- 정렬
- 페이지네이션
- 고객 상세/구독 운영 진입 링크

### 2. `/admin/subscriptions`
- 구독 상태 KPI
- 구독 검색/필터/정렬
- 상태 변경 확인 절차
- 처리 성공 피드백
- 최근 상태 변경 activity feed

## 구현 방향

### 1. 고객 탐색과 구독 조작의 분리
- 고객 목록은 운영자가 대상을 빠르게 찾는 진입 화면으로 유지한다.
- 실제 상태 전환은 `/admin/subscriptions`에서만 처리해 관리 액션의 맥락을 분명히 한다.

### 2. 기존 도메인 모듈 재사용
- `buildCustomerTableRows` 계열 helper를 고객 목록 화면과 구독 운영 화면이 함께 사용하도록 유지한다.
- `SubscriptionStatusWorkbench`는 전용 라우트로 옮기고, 고객 목록에는 더 가벼운 테이블 뷰를 만든다.

### 3. 권한 모델 현실화
- `support`는 구독 운영을 수행할 수 있고, `billing_manager`는 결제/환불에 집중하도록 분리한다.
- navigation, route policy, access summary가 같은 기준을 사용하도록 함께 수정한다.

## 리스크

### 리스크 1
고객 목록과 구독 화면 링크가 끊기면 운영 동선이 어색해질 수 있다.

대응:
- 고객 목록 행마다 고객 상세와 구독 운영 바로가기 링크를 모두 제공한다.

### 리스크 2
구독 운영 페이지 추가 후 관리자 권한 요약 숫자가 달라질 수 있다.

대응:
- admin access snapshot과 테스트를 같이 갱신해 숫자와 노출 route를 고정한다.

### 리스크 3
문서상 필수 화면을 채우는 과정에서 기존 테스트 데이터가 부족해 보일 수 있다.

대응:
- 현재 목업 데이터 범위 안에서 빈 상태와 기본 성공 흐름을 모두 검증한다.

## 완료 기준

- `/admin/customers`가 고객 목록 화면으로 정상 동작한다.
- `/admin/subscriptions`가 상태 변경 워크벤치로 동작한다.
- 관리자 내비게이션과 권한 정책에 subscriptions가 반영된다.
- 관련 테스트가 통과한다.
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`

## 다음 단계

Step 18에서는 고객/관리자 화면 사이의 cross-link와 공통 도메인 조합 로직을 더 정리하거나, 아직 비어 있는 운영 흐름의 디테일을 보강하는 단계로 이어갈 수 있다.
