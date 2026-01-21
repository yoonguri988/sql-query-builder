/**
 * SQL 쿼리 타입 정의
 */

import { TableData } from "./table";

/**
 * SQL 값의 기본 타입
 * SQL.js에서 반환할 수 있는 모든 값 타입
 */
export type SqlValue = string | number | boolean | null | Uint8Array;

// WHERE 조건 연산자
export type WhereOperator =
  | "="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<="
  | "LIKE"
  | "IN"
  | "IS NULL"
  | "IS NOT NULL";

// WHERE 조건 로직 연산자
export type LogicalOperator = "AND" | "OR";

// WHERE 조건
export interface WhereCondition {
  id: string; // 고유 ID
  column: string;
  operator: WhereOperator;
  value: string | number;
  logicalOperator?: LogicalOperator;
}

// ORDER BY 정렬
export interface OrderByClause {
  id: string;
  column: string;
  direction: "ASC" | "DESC";
}

// Query 상태
export interface QueryState {
  // FROM
  selectedTable: string | undefined;

  // SELECT
  selectedColumns: string[];
  // selectAll: boolean;

  // WHERE
  whereConditions: WhereCondition[];

  // ORDER BY
  orderBy: OrderByClause[];

  // LIMIT
  limit: number;

  // 생성된 SQL
  generatedSQL: string;

  queryResult: TransformedQueryResult | null; // 이미 변환된 형태 사용
  // 실행 메타 데이터
  executionMetadata: ExecutionMetadata | null; // 이름 변경 및 타입 명확화

  // 하위 호환성
  executionTime: number | null;
  error: string | null;
}

// SQL.js에서 반환하는 원시 데이터
export interface QueryResult {
  columns: string[];
  values: SqlValue[][]; //
  rowCount: number;
}

// UI에서 사용할 변환된 데이터
export interface TransformedQueryResult {
  columns: string[];
  data: TableData[]; // 객체 배열
  rowCount: number;
}

// 변환된 데이터 + 실행 정보 (통합)
export interface ExecutionResult {
  data: TransformedQueryResult;
  metadata: ExecutionMetadata;
}

// Query History Item
export interface QueryHistoryItem {
  id: string;
  sql: string;
  timestamp: Date;
  executionTime: number;
  rowCount: number;
  // 히스토리 타입 확장
  status: "success" | "error" | "idle";
  error?: string;
  queryState?: QueryState; // 쿼리 빌더 상태 저장
}

// 실행 정보 (시간, 상태, 에러)
export interface ExecutionMetadata {
  executionTime: number; // milliseconds
  rowCount: number;
  status: "success" | "error";
  error?: string;
  timestamp: Date;
}
