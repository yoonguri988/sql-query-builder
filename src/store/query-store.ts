import { create } from "zustand";
import {
  QueryState,
  WhereCondition,
  OrderByClause,
  QueryHistoryItem,
} from "@/types/query";
import { executeQuery as dbExecuteQuery } from "@/lib/db/init-db";
import validateQueryState from "@/lib/query/validateQueryState";
import { escapeSQLString } from "@/lib/utils";

interface QueryStore extends QueryState {
  // FROM 액션
  setSelectedTable: (table: string) => void;

  // SELECT 액션
  toggleColumn: (column: string) => void;
  setSelectedColumns: (columns: string[]) => void;
  selectAllColumns: (columns: string[]) => void;
  deselectAllColumns: () => void;

  // WHERE 액션
  addWhereCondition: (condition: WhereCondition) => void;
  updateWhereCondition: (id: string, updates: Partial<WhereCondition>) => void;
  removeWhereCondition: (id: string) => void;

  // ORDER BY 액션
  addOrderBy: (orderBy: OrderByClause) => void;
  updateOrderBy: (id: string, updates: Partial<OrderByClause>) => void;
  removeOrderBy: (id: string) => void;

  // LIMIT 액션
  setLimit: (limit: number) => void;

  // SQL 생성
  generateSQL: () => void;

  // 쿼리 실행
  executeQuery: () => Promise<void>;

  // 리셋
  reset: () => void;

  // 쿼리 히스토리
  queryHistory: QueryHistoryItem[];
  addToHistory: (item: QueryHistoryItem) => void;
  clearHistory: () => void;
}

const initialState: QueryState = {
  selectedTable: "",
  selectedColumns: [],
  whereConditions: [],
  orderBy: [],
  limit: 100,
  generatedSQL: "",
  queryResult: null,
  executionTime: null,
  error: null,
};

export const useQueryStore = create<QueryStore>((set, get) => ({
  ...initialState,
  queryHistory: [],
  // FROM 절
  setSelectedTable: (table) => {
    set({
      selectedTable: table,
      selectedColumns: [], // 테이블 변경시 컬럼 선택 초기화
      whereConditions: [], // 테이블 변경시 WHERE 선택 초기화
      orderBy: [], // 테이블 변경시 ORDER BY 선택 초기화
    });
    get().generateSQL();
  },

  // SELECT 절
  toggleColumn: (column) => {
    set((state) => {
      const isSelected = state.selectedColumns.includes(column);
      return {
        selectedColumns: isSelected
          ? state.selectedColumns.filter((c) => c !== column)
          : [...state.selectedColumns, column],
      };
    });
    get().generateSQL();
  },

  setSelectedColumns: (columns) => {
    set({ selectedColumns: columns });
    get().generateSQL();
  },

  selectAllColumns: (columns) => {
    set({ selectedColumns: columns });
    get().generateSQL();
  },

  deselectAllColumns: () => {
    set({ selectedColumns: [] });
    get().generateSQL();
  },

  // WHERE 절
  addWhereCondition: (condition) => {
    set((state) => ({
      whereConditions: [...state.whereConditions, condition],
    }));
    get().generateSQL();
  },

  updateWhereCondition: (id, updates) => {
    set((state) => ({
      whereConditions: state.whereConditions.map((condition) =>
        condition.id === id ? { ...condition, ...updates } : condition
      ),
    }));
    get().generateSQL();
  },

  removeWhereCondition: (id) => {
    set((state) => ({
      whereConditions: state.whereConditions.filter(
        (condition) => condition.id !== id
      ),
    }));
    get().generateSQL();
  },

  // ORDER BY 절
  addOrderBy: (orderBy) => {
    set((state) => ({
      orderBy: [...state.orderBy, orderBy],
    }));
    get().generateSQL();
  },

  updateOrderBy: (id, updates) => {
    set((state) => ({
      orderBy: state.orderBy.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      ),
    }));
    get().generateSQL();
  },

  removeOrderBy: (id) => {
    set((state) => ({
      orderBy: state.orderBy.filter((order) => order.id !== id),
    }));
    get().generateSQL();
  },

  // LIMIT
  setLimit: (limit) => {
    set({ limit });
    get().generateSQL();
  },

  // SQL 생성
  generateSQL: () => {
    const state = get();

    /** 검증 로직 */
    const validation = validateQueryState(state);
    if (!validation.isValid) {
      set({
        generatedSQL: "",
        error: validation.errors[0]?.message || "쿼리 검증에 실패했습니다.",
      });
      return;
    }
    /** 검증 성공 시 에러 초기화 */
    set({ error: null });

    // 테이블 체크
    if (!state.selectedTable) {
      set({ generatedSQL: "" });
      return;
    }

    let sql = "SELECT ";

    // SELECT 절
    if (state.selectedColumns.length === 0) {
      sql += "*";
    } else {
      sql += state.selectedColumns.join(", ");
    }

    // FROM 절
    sql += ` FROM ${state.selectedTable}`;

    // WHERE 절
    if (state.whereConditions.length > 0) {
      sql += " WHERE ";
      state.whereConditions.forEach((condition, index) => {
        if (index > 0 && condition.logicalOperator) {
          sql += ` ${condition.logicalOperator} `;
        }

        if (
          condition.operator === "IS NULL" ||
          condition.operator === "IS NOT NULL"
        ) {
          sql += `${condition.column} ${condition.operator}`;
        } else if (condition.operator === "LIKE") {
          const escapedValue = escapeSQLString(condition.value);
          sql += `${condition.column} LIKE '%${escapedValue}%'`;
        } else if (condition.operator === "IN") {
          sql += `${condition.column} IN (${condition.value})`;
        } else {
          // 숫자 타입은 따옴표 없이, 텍스트는 따옴표 포함
          const needsQuotes = isNaN(Number(condition.value));
          if (needsQuotes) {
            const escapedValue = escapeSQLString(condition.value);
            sql += `${condition.column} ${condition.operator} '${escapedValue}'`;
          } else {
            sql += `${condition.column} ${condition.operator} ${condition.value}`;
          }
        }
      });
    }

    // ORDER BY 절
    if (state.orderBy.length > 0) {
      sql += " ORDER BY ";
      sql += state.orderBy
        .map((order) => `${order.column} ${order.direction}`)
        .join(", ");
    }

    // LIMIT 절
    if (state.limit > 0) {
      sql += ` LIMIT ${state.limit}`;
    }

    set({ generatedSQL: sql });
  },

  // 쿼리 실행 (SQL.js 통합 예정)
  executeQuery: async () => {
    const state = get();

    if (!state.generatedSQL) {
      set({ error: "SQL 쿼리가 생성되지 않았습니다." });
      return;
    }

    try {
      const startTime = performance.now();

      // SQL.js 데이터베이스에서 쿼리 실행
      const result = dbExecuteQuery(state.generatedSQL);

      const endTime = performance.now();
      const executionTime = Math.round(endTime - startTime);

      set({
        queryResult: result,
        executionTime,
        error: null,
      });

      // 히스토리에 추가
      get().addToHistory({
        id: Date.now().toString(),
        sql: state.generatedSQL,
        timestamp: new Date(),
        executionTime,
        rowCount: 0,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "쿼리 실행 중 오류가 발생했습니다.",
        queryResult: null,
        executionTime: null,
      });
    }
  },
  // 리셋
  reset: () => {
    set(initialState);
  },

  // 쿼리 히스토리
  addToHistory: (item) => {
    set((state) => ({
      queryHistory: [item, ...state.queryHistory].slice(0, 20), // 최대 20개
    }));
  },

  clearHistory: () => {
    set({ queryHistory: [] });
  },
}));
