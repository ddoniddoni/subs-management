# Bootstrap Step 19: Admin Route Polish

## Step Summary

관리자 상세 페이지와 운영 워크벤치 사이의 이동 경험을 정리하는 단계다. 화면 상단에서 현재 위치를 설명하고, 관련 엔티티로 바로 이동할 수 있는 링크를 공통된 방식으로 제공한다.

## Why Now

- 고객/결제/환불/구독 기능은 이미 개별 화면으로 갖춰졌다.
- step 18에서 구독 운영 워크벤치의 액션 안정성을 높였기 때문에, 이제 화면 간 연결 경험을 다듬을 타이밍이다.
- 운영자 관점에서는 단일 화면 완성도보다 화면 간 맥락 이동이 더 큰 체감 품질로 이어진다.

## Intended Output

- 상세 화면별 breadcrumb 표시
- 관련 목록 및 연관 엔티티로 가는 quick-link 정리
- command center에서 더 직접적인 진입 링크 제공
- 테스트로 주요 링크와 상단 컨텍스트 확인

## Non-Goals

- 새로운 관리자 도메인 화면 추가
- 전역 레이아웃 구조 변경
- 서버 데이터 계층 리팩터링

## Validation Plan

- 상세 화면 테스트에서 breadcrumb 및 quick-link 확인
- command center 관련 링크 테스트 유지 또는 보강
- 전체 lint/typecheck/test/build 통과
