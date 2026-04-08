# 실행 계획 - Bootstrap Step 01 라우트 및 폴더 기반 구성

## 목적

전체 부트스트랩을 한 번에 진행하지 않고, 첫 단계로 프로젝트의 기본 폴더 구조와 주요 라우트 골격만 먼저 만든다.

## 이번 단계에서 할 일

- `src/features`, `src/components`, `src/lib`, `src/mocks`, `src/types` 기본 구조 생성
- 고객용 라우트 골격 생성
- 관리자용 라우트 골격 생성
- 각 페이지에 최소한의 제목과 설명 추가
- 이후 레이아웃 작업을 붙이기 쉬운 구조로 정리

## 이번 단계에서 하지 않을 일

- 관리자 사이드바 / 헤더 등 본격 레이아웃 구성
- 공통 UI 프리미티브 구현
- 실제 도메인 타입 및 목업 데이터 작성
- 테스트 환경 추가
- 상세 인터랙션 구현

## 대상 라우트

### 고객용
- `/`
- `/pricing`
- `/checkout`
- `/app/subscription`
- `/app/billing`

### 관리자용
- `/admin`
- `/admin/customers`
- `/admin/payments`
- `/admin/refunds`
- `/admin/coupons`
- `/admin/analytics`
- `/admin/admin-users`
- `/admin/audit-log`

## 생성할 기본 구조

```txt
src/
  app/
  features/
    customers/
    subscriptions/
    payments/
    refunds/
    coupons/
    analytics/
    admin-users/
    audit-log/
  components/
    ui/
    shared/
  lib/
  mocks/
  types/
```

## 구현 원칙

- 페이지는 플레이스홀더 수준으로 단순하게 유지한다.
- 각 페이지는 실제 제품의 목적이 드러나는 제목과 설명을 가진다.
- 고객용과 관리자용 흐름을 라우트 구조만으로도 구분할 수 있게 만든다.
- 이후 레이아웃과 공통 컴포넌트 도입 시 파일 이동이 거의 없도록 구조를 잡는다.

## 리스크

### 리스크 1
라우트만 만들고도 구조가 금방 바뀔 수 있다.

대응:
- 공통 텍스트와 단순 섹션만 두고, 복잡한 UI는 다음 단계로 미룬다.

### 리스크 2
고객용과 관리자용 책임 구분이 흐려질 수 있다.

대응:
- 경로와 설명 문구에서 역할을 명확하게 분리한다.

## 완료 기준

- 대상 라우트가 모두 생성된다.
- 폴더 구조가 만들어진다.
- 각 페이지가 정상 렌더링된다.
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## 다음 단계

Step 02에서는 고객용 / 관리자용 공통 레이아웃과 내비게이션을 붙인다.
