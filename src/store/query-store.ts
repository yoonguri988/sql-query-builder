import { create } from "zustand";
import {
  QueryState,
  WhereCondition,
  OrderByClause,
  QueryHistoryItem,
  ExecutionResult,
  ExecutionMetadata,
} from "@/types/query";
import { executeQueryWithMetadata, initDatabase } from "@/lib/db/init-db";
import validateQueryState from "@/lib/query/validateQueryState";
import { escapeSQLString } from "@/lib/utils";
import { SQLExecutionError } from "@/lib/db/sql-errors";
import { toast } from "@/hooks/use-toast";

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

  // 실행 관련 상태 추가
  isExecuting: boolean;
  isDbInitialized: boolean;

  // DB 초기화 액션
  initDB: () => Promise<void>;

  // 쿼리 실행
  executeQuery: () => Promise<ExecutionResult | null>;

  // 리셋
  reset: () => void;
  resetExecution: () => void;
  resetAll: () => void;
  resetWhereConditions: () => void;

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
  executionMetadata: null,
  executionTime: null,
  error: null,
};

export const useQueryStore = create<QueryStore>((set, get) => ({
  ...initialState,
  queryHistory: [],

  isExecuting: false,
  isDbInitialized: false,
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
    sql += ` \nFROM ${state.selectedTable}`;

    // WHERE 절
    if (state.whereConditions.length > 0) {
      sql += " \nWHERE ";
      state.whereConditions.forEach((condition, index) => {
        if (index > 0 && condition.logicalOperator) {
          sql += ` \n\t${condition.logicalOperator} `;
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
      sql += " \nORDER BY ";
      sql += state.orderBy
        .map((order) => `${order.column} ${order.direction}`)
        .join(", ");
    }

    // LIMIT 절
    if (state.limit > 0) {
      sql += ` \nLIMIT ${state.limit}`;
    }

    set({ generatedSQL: sql });
  },

  // 쿼리 실행
  executeQuery: async () => {
    const state = get();

    if (!state.generatedSQL) {
      set({
        error: "SQL 쿼리가 생성되지 않았습니다.",
        queryResult: null,
        executionMetadata: null,
      });
      return null;
    }

    // DB 초기화 체크
    if (!state.isDbInitialized) {
      await get().initDB();
    }

    // 실행 시작
    set({
      isExecuting: true,
      error: null,
      queryResult: null,
      executionMetadata: null,
      executionTime: null,
    });

    try {
      // executeQueryWithMetadata 사용
      const result = await executeQueryWithMetadata(state.generatedSQL);

      // 결과 저장
      set({
        queryResult: result.data,
        executionMetadata: result.metadata,
        executionTime: result.metadata.executionTime,
        error:
          result.metadata.status === "error"
            ? result.metadata.error || null
            : null,
        isExecuting: false,
      });

      // 성공 Toast 알림
      if (result.metadata.status === "success") {
        toast({
          title: "쿼리 실행 성공",
          description: `${result.data.rowCount}개의 행이 ${result.metadata.executionTime}ms에 반환되었습니다.`,
        });

        // 히스토리에 자동 저장
        get().addToHistory({
          id: "", // addToHistory에서 자동 생성
          sql: state.generatedSQL,
          timestamp: new Date(),
          executionTime: result.metadata.executionTime,
          rowCount: result.data.rowCount,
          status: "success",
        });
      }

      // ExecutionResult 반환
      return result;
    } catch (e) {
      let errorMessage = "쿼리 실행 중 오류가 발생했습니다.";

      if (e instanceof SQLExecutionError) {
        errorMessage = e.getUserMessage();

        if (process.env.NODE_ENV === "development") {
          console.error(e.getDebugInfo());
        }
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }

      // 에러 메타데이터 생성
      const errorMetadata: ExecutionMetadata = {
        executionTime: 0,
        rowCount: 0,
        status: "error",
        error: errorMessage,
        timestamp: new Date(),
      };

      set({
        error: errorMessage,
        isExecuting: false,
        queryResult: null,
        executionMetadata: errorMetadata,
        executionTime: 0,
      });

      // 에러 Toast 알림
      toast({
        variant: "destructive",
        title: "쿼리 실행 실패",
        description: errorMessage,
      });

      // 에러도 히스토리에 저장
      get().addToHistory({
        id: "", // addToHistory에서 자동 생성
        sql: state.generatedSQL,
        timestamp: new Date(),
        executionTime: 0,
        rowCount: 0,
        status: "error",
        error: errorMessage,
      });

      // 에러 결과도 ExecutionResult 형태로 반환
      return {
        data: { columns: [], data: [], rowCount: 0 },
        metadata: errorMetadata,
      };
    }
  },

  // DB 초기화 함수
  initDB: async () => {
    // 이미 초기화됨
    if (get().isDbInitialized) {
      console.log("DB 이미 초기화됨");
      return;
    }

    try {
      console.log("데이터베이스 초기화 시작...");
      await initDatabase(true);
      set({ isDbInitialized: true });
      console.log("데이터베이스 초기화 완료");
    } catch (error) {
      console.error("데이터베이스 초기화 실패:", error);
      set({
        error: "데이터베이스 초기화에 실패했습니다.",
        isDbInitialized: false,
      });
    }
  },
  // 리셋
  reset: () => {
    set({
      ...initialState,
      // 실행 상태도 초기화
      isExecuting: false,
      queryHistory: get().queryHistory, // 히스토리는 유지
    });
  },
  // 실행 관련 상태만 초기화
  resetExecution: () => {
    set({
      queryResult: null,
      executionTime: null,
      isExecuting: false,
    });
  },

  // WHERE 조건만 초기화
  resetWhereConditions: () => {
    set({
      whereConditions: [],
    });
    get().generateSQL();
  },

  // 전체 상태 초기화
  resetAll: () => {
    set({
      ...initialState,
      queryResult: null,
      executionTime: null,
      isExecuting: false,
      generatedSQL: "",
      error: null,
    });
  },
  // 쿼리 히스토리
  addToHistory: (item) => {
    const newItem: QueryHistoryItem = {
      ...item,
      id: `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    set((state) => ({
      queryHistory: [newItem, ...state.queryHistory].slice(0, 20),
    }));
  },

  clearHistory: () => {
    set({ queryHistory: [] });
  },
}));
