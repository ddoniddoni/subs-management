# Step 19 Execplan: Admin Route Polish

## Goal

관리자 상세 라우트와 운영 워크벤치 사이를 더 자연스럽게 오갈 수 있도록 공통 상단 컨텍스트와 빠른 이동 링크를 정리한다.

## Assumptions

- `develop`에는 `step/18-subscription-ops-hardening`까지 반영되어 있다.
- 현재 관리자 상세 페이지는 고객, 결제, 환불 상세 3종과 구독 운영 워크벤치가 핵심 이동 축이다.
- 실제 운영자는 목록 화면과 상세 화면을 반복 이동하므로, 현재 위치와 관련 엔티티 이동 링크를 한 화면에서 이해할 수 있어야 한다.

## Scope

- 공통 관리자 라우트 컨텍스트 UI를 추가한다.
- 고객/결제/환불 상세 화면 상단에 breadcrumb와 관련 작업 링크를 배치한다.
- 구독 운영 워크벤치에 현재 흐름과 관련 라우트 진입 링크를 보강한다.
- command center의 watchlist 또는 빠른 이동 링크를 더 직접적인 상세 동선으로 다듬는다.
- 관련 테스트를 갱신한다.

## Implementation Steps

1. 관리자 라우트용 breadcrumb/quick-link 조합 컴포넌트 설계
2. 고객 상세, 결제 상세, 환불 상세 화면에 공통 컨텍스트 적용
3. 구독 운영 워크벤치와 command center 링크 정리
4. 관련 단위 테스트 갱신
5. lint, typecheck, test, build 검증

## Risks

- 공통 헤더 도입이 기존 `PageHeader` 사용 패턴과 충돌할 수 있다.
- 링크를 늘리면서 중복 정보가 많아지면 오히려 가독성이 떨어질 수 있다.
- 테스트가 한국어 접근성 이름에 강하게 묶여 있으므로 문구 조정 시 실패 가능성이 있다.

## Verification

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`
