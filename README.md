# SQL Query Builder

> React 프론트엔드 개발자 포트폴리오 프로젝트

Visual SQL Query Builder built with Next.js 15.1, TypeScript 5.7, and SQL.js

## 🚀 주요 기능

- **비주얼 쿼리 빌더**: GUI로 SQL 쿼리 생성
- **실시간 SQL 프리뷰**: 생성된 SQL 코드 실시간 확인
- **브라우저 내 DB**: SQL.js로 클라이언트 사이드 데이터베이스
- **데이터 시각화**: Recharts로 쿼리 결과 차트 생성
- **쿼리 히스토리**: 과거 실행 쿼리 관리

## 🛠 기술 스택

### 핵심 프레임워크

- **React** 19.0.0
- **Next.js** 15.1.0 (App Router)
- **TypeScript** 5.7.0

### 상태 관리

- **Zustand** 5.0.0

### UI 라이브러리

- **Tailwind CSS** 4.0.0
- **shadcn/ui** (latest)
- **Radix UI** (Primitives)

### 데이터 처리

- **SQL.js** 1.12.0 (브라우저 내 SQLite)
- **TanStack Table** 8.20.0
- **date-fns** 4.1.0

### 데이터 시각화

- **Recharts** 2.15.0

### 폼 & 검증

- **React Hook Form** 7.54.0
- **Zod** 3.23.8

## 📦 설치 및 실행

### 1. 저장소 클론 또는 파일 압축 해제

```bash
cd sql-query-builder
```

### 2. 의존성 설치

```bash
npm install
```

### 3. SQL.js WebAssembly 파일 복사

```bash
# node_modules에서 public 폴더로 복사
cp node_modules/sql.js/dist/sql-wasm.wasm public/
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📚 프로젝트 구조

```
sql-query-builder/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── query-builder/      # 쿼리 빌더 UI
│   │   ├── results/            # 결과 테이블
│   │   └── visualization/      # 차트
│   ├── lib/
│   │   ├── db/                 # DB 초기화 & 스키마
│   │   └── query/              # SQL 쿼리 생성 로직
│   ├── store/                  # Zustand 스토어
│   └── types/                  # TypeScript 타입 정의
└── public/
    └── sql-wasm.wasm           # SQL.js WebAssembly
```

## 🗄️ 데이터베이스 스키마

E-commerce 샘플 데이터베이스:

- **users** (20 레코드)
- **categories** (6 레코드, 계층 구조)
- **products** (100 레코드)
- **orders** (150 레코드)
- **order_items** (300+ 레코드)

## 📝 사용 가능한 스크립트

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm start

# ESLint 검사
npm run lint

# ESLint 자동 수정
npm run lint:fix

# Prettier 포맷팅
npm run format

# Prettier 검사
npm run format:check
```

## 🎯 개발 일정 (1주차)

- **1일차**: Next.js + TypeScript 초기화, Tailwind 설정
- **2일차**: 폴더 구조 확정, Git 초기화, ESLint/Prettier
- **3일차**: 메인 레이아웃 (Header, Sidebar, Main, RightPanel)
- **4일차**: SQL.js 설치 및 DB 스키마 작성
- **5일차**: 샘플 데이터 생성 (100~200개 레코드)
- **6일차**: Zustand 스토어 설계
- **7일차**: DB 스키마 트리뷰 UI (Accordion)
