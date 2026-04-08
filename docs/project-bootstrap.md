# 실행 계획 - 프로젝트 초기 구성

## 목표

**Subscription Ops Console** 프로젝트가 안정적인 구조 위에서 바로 기능 개발을 시작할 수 있도록 초기 기반을 구성합니다.

## 기대 결과

이 계획이 끝나면 저장소는 아래를 갖춰야 합니다.

- Next.js + TypeScript 기반 앱
- lint / typecheck / test / build 명령어
- 고객용 / 관리자용 라우트 골격
- 기본 도메인 타입과 목업 데이터
- 공통 레이아웃, 내비게이션, 상태 배지, 테이블 기본 컴포넌트
- 이후 작업을 위한 문서화 기반

## 가정

- 기존 코드를 유지할 필요는 없습니다.
- v1은 실제 백엔드 연동보다 목업 데이터를 우선합니다.
- 관리자 영역 중심으로 확장 가능한 구조가 필요합니다.
- 스타일링 방식은 하나로 통일합니다.

## 범위

### 포함
- 프로젝트 초기화
- 개발 도구 및 품질 검사 설정
- 기본 폴더 구조 생성
- 라우트 플레이스홀더 추가
- 주요 도메인 모델 및 목업 데이터 정의
- 공통 UI 기본 컴포넌트 구성
- 설계 결정 사항 및 후속 작업 문서화

### 제외
- 실제 결제 연동
- 프로덕션 인증 연동
- 서버 저장소 구현
- 과한 마케팅 애니메이션
- 고급 차트 구현

## 구현 단계

### 1. 저장소 초기화
- Next.js App Router + TypeScript로 앱 생성
- TypeScript strict 설정 적용
- 패키지 매니저 결정 및 의존성 설치
- dev / lint / typecheck / test / build 스크립트 추가

### 2. 프로젝트 구조 구성
필요 시 아래 디렉터리를 생성합니다.

```txt
src/app
src/features
src/components/ui
src/components/shared
src/lib
src/mocks
src/types
tests
docs/execplans
```

### 3. 앱 골격 및 내비게이션 구성
- 고객용 라우트: `/`, `/pricing`, `/checkout`, `/app/subscription`, `/app/billing`
- 관리자 라우트: `/admin`, `/admin/customers`, `/admin/payments`, `/admin/refunds`, `/admin/coupons`, `/admin/analytics`, `/admin/admin-users`, `/admin/audit-log`
- 공통 레이아웃 구성
- 관리자 사이드바 구성
- 각 페이지에 기본 제목과 플레이스홀더 추가

### 4. 도메인 타입 및 목업 데이터 정의
다음 항목의 타입과 목업 데이터를 정의합니다.

- customer
- plan
- subscription
- payment / invoice
- refund
- coupon
- admin user
- audit event
- metric snapshot

요구사항:
- 상태 enum / 상수는 중앙 관리
- 필터와 예외 케이스를 검증할 수 있도록 데이터 다양성 확보
- 엔티티 간 관계는 자연스럽게 구성

### 5. 공통 UI 기본 컴포넌트 구성
- page header
- stat card
- status badge
- data table shell
- filter bar shell
- empty state
- error state
- loading skeleton
- confirmation dialog shell

페이지 전용이 아니라 재사용 가능한 구조로 만듭니다.

### 6. 기능 단위 기본 구조 생성
아래 기능 모듈의 기본 구조를 만듭니다.

- `features/customers`
- `features/subscriptions`
- `features/payments`
- `features/refunds`
- `features/coupons`
- `features/analytics`
- `features/admin-users`
- `features/audit-log`

### 7. 품질 도구 추가
- ESLint
- 필요 시 Prettier
- 테스트 프레임워크
- E2E 프레임워크
- CI 친화적 스크립트

### 8. 초기 테스트 추가
최소한 아래 테스트를 포함합니다.

- 라우트 또는 핵심 컴포넌트 스모크 테스트 1개
- 도메인 유틸 테스트 1개
- 확장 가능한 E2E 플레이스홀더 1개

### 9. 아키텍처 문서화
- `README.md` 최신화
- 필요 시 `AGENTS.md` 업데이트
- 큰 기능 작업 전 추가 실행 계획 문서 작성

## 리스크 및 대응

### 부트스트랩을 과하게 만드는 경우
- 플레이스홀더는 단순하게 유지하고 복잡한 로직은 이후 단계로 넘깁니다.

### UI 방식이 중간에 바뀌는 경우
- 초기에 방향을 정하고 일관되게 유지합니다.

### 목업 데이터가 비현실적인 경우
- 상태값과 예외 케이스를 처음부터 포함합니다.

### 고객용 화면에 과하게 집중하는 경우
- 고객 영역은 얇게 유지하고 관리자 워크플로우에 집중합니다.

## 검증 기준

아래 조건을 만족하면 초기 구성이 완료된 것입니다.

- 앱이 로컬에서 실행된다.
- 계획한 모든 라우트가 렌더링된다.
- lint가 통과한다.
- typecheck가 통과한다.
- test가 통과한다.
- build가 성공한다.
- 목업 데이터로 의미 있는 화면 구성이 가능하다.
- 문서와 실제 구조가 일치한다.

## 후속 실행 계획

다음 문서를 순차적으로 작성합니다.

- `docs/execplans/customer-surface-v1.md`
- `docs/execplans/admin-customer-workflows.md`
- `docs/execplans/payments-and-refunds.md`
- `docs/execplans/analytics-and-audit-log.md`
- `docs/execplans/testing-and-a11y-pass.md`
