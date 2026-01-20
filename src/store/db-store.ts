import { create } from "zustand";
import { Database } from "sql.js";
import { TableSchema } from "@/types/database";
import { executeQueryWithMetadata, initDatabase } from "@/lib/db/init-db";
import { DATABASE_SCHEMA } from "@/types/schema";
import { ExecutionResult } from "@/types/query";

interface DBStore {
  // 데이터베이스 인스턴스
  database: Database | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // 스키마 정보
  tables: TableSchema[];
  selectedTable: string | null;

  // 쿼리 실행 결과 및 상태
  queryResults: ExecutionResult | null;
  isExecuting: boolean;

  // 액션
  initialize: () => Promise<void>;
  selectTable: (tableName: string) => void;

  // 새로운 실행 함수
  executeQuery: (sql: string) => Promise<ExecutionResult>;
  setQueryResults: (results: ExecutionResult) => void;
  setIsExecuting: (isExecuting: boolean) => void;
  clearResults: () => void;
}

export const useDBStore = create<DBStore>((set, get) => ({
  // 기본 상태
  database: null,
  isInitialized: false,
  isLoading: false,
  error: null,
  tables: DATABASE_SCHEMA,
  selectedTable: null,
  // 쿼리 실행 상태
  queryResults: null,
  isExecuting: false,

  // 데이터베이스 초기화
  initialize: async () => {
    set({ isLoading: true, error: null });

    try {
      const db = await initDatabase(true);
      set({
        database: db,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      });
    }
  },
  // 테이블 선택
  selectTable: (tableName) => {
    set({ selectedTable: tableName });
  },

  // 쿼리 실행 (메타데이터 포함)
  executeQuery: async (sql: string) => {
    const { database } = get();
    if (!database) {
      const errorResult: ExecutionResult = {
        data: { columns: [], data: [], rowCount: 0 },
        metadata: {
          executionTime: 0,
          rowCount: 0,
          status: "error",
          error: "데이터베이스가 초기화되지 않았습니다.",
          timestamp: new Date(),
        },
      };
      set({ queryResults: errorResult });
      return errorResult;
    }

    // 실행 시작
    set({ isExecuting: true, error: null });

    try {
      const result = await executeQueryWithMetadata(sql);

      // 결과 저장
      set({
        queryResults: result,
        isExecuting: false,
        error:
          result.metadata.status === "error"
            ? result.metadata.error || null
            : null,
      });

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Query failed";

      const errorResult: ExecutionResult = {
        data: { columns: [], data: [], rowCount: 0 },
        metadata: {
          executionTime: 0,
          rowCount: 0,
          status: "error",
          error: errorMessage,
          timestamp: new Date(),
        },
      };
      set({
        queryResults: errorResult,
        isExecuting: false,
        error: errorMessage,
      });
      return errorResult;
    }
  },
  // 쿼리 결과 직접 설정
  setQueryResults: (results) => {
    set({ queryResults: results });
  },

  // 실행 상태 설정
  setIsExecuting: (isExecuting) => {
    set({ isExecuting });
  },

  // 결과 초기화
  clearResults: () => {
    set({ queryResults: null, error: null });
  },
}));
