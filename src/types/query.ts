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

  // 쿼리 결과: any[] | null;
  /* ?? any 대신 구체적인 타입을 정의 하도록 노력 */
  // queryResult: any[] | null;
  queryResult: QueryResult | null;

  // 실행 메타 데이터
  executionTime: number | null;
  error: string | null;
}

// Query 실행 결과
export interface QueryResult {
  columns: string[];
  values: SqlValue[][]; //
  rowCount: number;
}

// 변환된 형태 결과
export interface TransformedQueryResult {
  columns: string[];
  data: TableData[]; // 객체 배열
  rowCount: number;
}

// Query History Item
export interface QueryHistoryItem {
  id: string;
  sql: string;
  timestamp: Date;
  executionTime: number;
  rowCount: number;
}
