// WHERE 조건 타입
export interface WhereCondition {
  id: string; // 고유 ID
  column: string;
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "IN";
  value: string | number;
  conjunction: "AND" | "OR";
}

// ORDER BY 타입
export interface OrderByClause {
  id: string;
  column: string;
  direction: "ASC" | "DESC";
}

// Query Builder 상태
export interface QueryState {
  // SELECT
  selectedColumns: string[];
  selectAll: boolean;

  // FROM
  selectedTable: string | null;

  // WHERE
  whereConditions: WhereCondition[];

  // ORDER BY
  orderBy: OrderByClause[];

  // LIMIT
  limit: number;

  // 생성된 SQL
  generatedSQL: string;

  // 쿼리 결과
  queryResult: QueryResult | null;
}

/** 251230 any 대신 구체적인 타입을 정의 */
export type SqlValue = string | number | null | boolean;

// Query 실행 결과
export interface QueryResult {
  columns: string[];
  values: SqlValue[][]; //
  rowCount: number;
  executionTime: number; // ms
}

// Query History Item
export interface QueryHistoryItem {
  id: string;
  sql: string;
  timestamp: Date;
  executionTime: number;
  rowCount: number;
}
