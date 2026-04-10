# Step 16 관리자 커맨드 센터 실행 계획

## 목표

- `/admin` 홈을 단순 KPI 요약 화면에서 오늘의 운영 우선순위를 보여주는 커맨드 센터로 전환한다.
- 실패 결제, 환불 대기, 취소 예정 구독, 만료 임박 쿠폰 같은 즉시 대응 항목을 한 화면에 모은다.
- 최근 감사 활동과 빠른 진입 링크를 함께 제공해 운영자가 다음 액션으로 바로 이어질 수 있게 한다.

## 가정

- 실시간 데이터 없이 기존 목업 데이터와 감사 로그를 조합해 운영 홈 화면을 구성한다.
- 분석 대시보드(`/admin/analytics`)와 겹치지 않도록, `/admin`은 “즉시 대응” 중심, `/admin/analytics`는 “추세 분석” 중심으로 역할을 나눈다.
- 홈 화면 인터랙션은 최소화하고, 상세 처리는 각 도메인 화면으로 이동하게 한다.

## 범위

- 관리자 홈 snapshot/helper 추가
- `/admin` 홈 화면 재구성
- 홈 화면 loading 상태 추가
- 관련 테스트 추가

## 구현 단계

1. command center helper 설계
   - KPI headline cards
   - priority queue
   - quick access links
   - customer watchlist / route summary
   - recent audit activity
2. 관리자 홈 view 구현
   - 운영 요약 카드
   - 우선 대응 큐
   - 빠른 진입 카드
   - 최근 활동 피드
3. route-level loading 상태 추가
4. 테스트 및 검증
   - helper 테스트
   - 홈 화면 렌더링 테스트
   - `npm.cmd run lint`
   - `npm.cmd run typecheck`
   - `npm.cmd run test`
   - `npm.cmd run build`

## 리스크

- `/admin/analytics`와 시각적으로 너무 비슷해질 수 있다.
  - 홈은 즉시 처리 큐와 이동 중심 구조로, analytics는 추세/분포 중심 구조로 분리한다.
- 목업 데이터가 적어 command center가 비어 보일 수 있다.
  - 감사 로그, 결제 실패, 환불, 쿠폰, 취소 예정 구독을 함께 조합해 밀도를 보강한다.
- 운영 요약이 많아지면 정보 과부하가 생길 수 있다.
  - 상단 KPI, 중단 priority queue, 하단 quick links / recent activity 순서로 구조를 단순화한다.

## 검증 방법

- 우선 대응 큐가 실패 결제, 환불 대기, 만료 임박 쿠폰, 취소 예정 구독을 올바르게 집계하는지 확인한다.
- 빠른 진입 링크가 적절한 관리자 화면으로 연결되는지 확인한다.
- 최근 활동 피드가 감사 로그 최신 순으로 정렬되는지 확인한다.
- 전체 검증 명령 `lint`, `typecheck`, `test`, `build`가 모두 통과하는지 확인한다.
