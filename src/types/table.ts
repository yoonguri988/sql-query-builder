import { SortingState } from "@tanstack/react-table";

/**
 * TanStack Table에서 사용할 타입 정의
 */
export type CellValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Uint8Array;

/**
 * 테이블 컬럼 정의
 */
export interface TableColumn {
  /** 컬럼의 고유 ID */
  id: string;
  /** 컬럼 헤더에 표시될 텍스트 */
  name: string;
  /** 데이터 객체에서 값을 가져올 키 */
  accessorKey: string;
  /** 컬럼 타입 (정렬 및 포맷팅에 사용) */
  type?: "string" | "number" | "date" | "boolean" | "blob";
  /** 정렬 가능 여부 */
  enableSorting?: boolean;
}

/**
 * 테이블 데이터 행
 * - 동적으로 생성되는 SQL 결과를 담기 위해 인덱스 시그니처 사용
 */
export interface TableData {
  [key: string]: CellValue;
}

/**
 * 쿼리 실행 결과
 */
export interface QueryResult {
  /** 결과 데이터 배열 */
  data: TableData[];
  /** 컬럼 정보 */
  columns: string[];
  /** 실행 시간 (ms) */
  executionTime: number;
  /** 행 개수 */
  rowCount: number;
}

/** 정렬 상태 타입 */
export type TableSortingState = SortingState;
