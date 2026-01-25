# Visualization 컴포넌트

## 기능

- 쿼리 결과 데이터를 차트로 시각화
- 지원 차트: Bar, Line, Pie
- X/Y축 자동 추천 및 수동 선택
- 다크모드 지원
- 반응형 레이아웃
- PNG 이미지 다운로드

## 사용 방법

1. SQL 쿼리 실행
2. MainContent의 "Visualization" 탭 선택
3. 차트 타입 선택 (Bar, Line, Pie)
4. X/Y축 컬럼 선택
5. 차트 옵션 조정 (범례, 그리드)
6. Download PNG 버튼으로 이미지 저장

## 데이터 요구사항

- 최소 1개 이상의 숫자형 컬럼 필요
- X축: 텍스트 또는 날짜 컬럼 권장
- Y축: 숫자형 컬럼만 가능
- Pie Chart는 Y축 1개만 선택 가능

## 쿼리 예시

### 카테고리별 매출 합계

```sql
SELECT category, SUM(sales) as total_sales
FROM products
GROUP BY category
ORDER BY total_sales DESC
LIMIT 10;
```

### 월별 주문 추이

```sql
SELECT
  strftime('%Y-%m', order_date) as month,
  COUNT(*) as order_count,
  SUM(total_amount) as total_sales
FROM orders
GROUP BY month
ORDER BY month;
```

### 제품별 재고 현황

```sql
SELECT
  product_name,
  units_in_stock
FROM products
WHERE units_in_stock > 0
ORDER BY units_in_stock DESC
LIMIT 15;
```

## 컴포넌트 구조

```
visualization/
├── VisualizationTab.tsx       # 메인 컨테이너
├── ChartSettings.tsx          # 차트 설정 UI
├── BarChart.tsx              # Bar Chart
├── LineChart.tsx             # Line Chart
├── PieChart.tsx              # Pie Chart
├── CustomTooltip.tsx         # 커스텀 툴팁
└── ChartGuide.tsx            # 사용자 가이드
```

## 주요 기능

### 자동 데이터 분석

- 컬럼 타입 자동 감지 (숫자/텍스트/날짜)
- X/Y축 후보 자동 추천
- 첫 번째 후보 자동 선택

### 다크모드 지원

- 라이트/다크 테마 자동 전환
- 차트 색상, 그리드, 텍스트 자동 조정
- 커스텀 툴팁으로 완전한 테마 지원

### PNG 다운로드

- SVG를 Canvas로 변환
- 흰색 배경 자동 추가
- 타임스탬프 포함 파일명

## 기술 스택

- **Recharts**: 차트 라이브러리
- **Zustand**: 차트 상태 관리
- **Tailwind CSS**: 스타일링
- **TypeScript**: 타입 안정성

## 성능 최적화

- useMemo로 데이터 변환 메모이제이션
- 쿼리 결과 변경 시만 재계산
- 불필요한 리렌더링 방지
