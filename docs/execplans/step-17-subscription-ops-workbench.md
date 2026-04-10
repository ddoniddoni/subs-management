# Step 17 구독 운영 워크벤치 실행 계획

## 목표

- `/admin/subscriptions` 라우트를 새로 추가해 구독 상태 변경을 전용 운영 화면에서 처리할 수 있게 만든다.
- 현재 잘못 배치된 `/admin/customers`의 구독 상태 워크벤치를 고객 목록 화면으로 정상화한다.
- 관리자 내비게이션과 권한 정책에 구독 운영 화면을 반영해 실제 운영 콘솔 흐름처럼 이어지게 만든다.

## 가정

- 실제 서버 연동 없이 기존 목업 데이터와 클라이언트 상태를 사용해 v1 운영 플로우를 표현한다.
- 기존 `SubscriptionStatusWorkbench`는 구독 운영 화면의 핵심 인터랙션으로 재사용하고, 고객 목록은 별도 뷰로 분리한다.
- 구독 운영 화면의 접근 권한은 `support`와 `ops_admin`에 우선 제공한다.

## 범위

- `/admin/subscriptions` 페이지 및 loading 상태 추가
- 고객 목록 전용 snapshot/helper와 view 추가
- 관리자 내비게이션 및 라우트 권한 정책 업데이트
- 관련 테스트 추가 및 기존 테스트 조정
- handoff 문서 최신화

## 구현 단계

1. step 17 계획 문서 2종 작성
2. 고객 목록 뷰 분리
   - 기존 customer table helper를 사용해 `/admin/customers` 전용 화면 구성
   - 검색, 필터, 정렬, 페이지네이션, 빈 상태 제공
3. 구독 운영 라우트 추가
   - `SubscriptionStatusWorkbench`를 `/admin/subscriptions`로 이동
   - route loading UI 추가
4. 관리자 권한/내비게이션 확장
   - navigation 항목에 subscriptions 추가
   - admin route policy와 관련 요약 계산 반영
5. 테스트 및 문서 정리
   - 고객 목록 화면
   - 구독 운영 워크벤치 접근
   - 관리자 권한 정책
   - context handoff 업데이트

## 리스크

- `/admin/customers`와 `/admin/subscriptions`의 역할이 겹치면 사용자가 혼란스러울 수 있다.
  - 고객 목록은 탐색과 진입, 구독 운영 화면은 상태 전환과 확인 절차 중심으로 역할을 분리한다.
- 권한 정책을 추가하면서 기존 관리자 접근 테스트가 깨질 수 있다.
  - 기존 `admin-access` 테스트를 함께 갱신해 role별 기대 동작을 고정한다.
- 고객 목록을 새 뷰로 분리하면서 step 08에서 구현한 검색/필터 요구가 퇴행할 수 있다.
  - customer table helper를 그대로 사용하고 인터랙션 테스트를 추가해 회귀를 막는다.

## 검증 방법

- `/admin/customers`에서 검색, 상태 필터, 플랜 필터, 정렬, 페이지네이션이 동작하는지 확인한다.
- `/admin/subscriptions`에서 상태 변경 확인 절차와 activity feed가 정상 동작하는지 확인한다.
- `support`, `billing_manager`, `ops_admin` 역할별로 subscriptions 접근 허용/차단이 기대대로 반영되는지 확인한다.
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`
