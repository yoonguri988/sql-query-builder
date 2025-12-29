import { create } from "zustand";
import { Database, QueryExecResult } from "sql.js";
import { TableSchema, TABLES } from "@/types/database";
import { initDatabase } from "@/lib/db/init-db";

interface DBStore {
  // 데이터베이스 인스턴스
  database: Database | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // 스키마 정보
  tables: TableSchema[];
  selectedTable: string | null;

  // 액션
  initialize: () => Promise<void>;
  selectTable: (tableName: string) => void;
  executeQuery: (sql: string) => QueryExecResult[] | null;
}

export const useDBStore = create<DBStore>((set, get) => ({
  database: null,
  isInitialized: false,
  isLoading: false,
  error: null,
  tables: TABLES,
  selectedTable: null,

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

  selectTable: (tableName) => {
    set({ selectedTable: tableName });
  },

  executeQuery: (sql) => {
    const { database } = get();
    if (!database) {
      console.error("Database not initialized");
      return null;
    }

    try {
      const result = database.exec(sql);
      return result;
    } catch (error) {
      console.error("Query execution error:", error);
      set({ error: error instanceof Error ? error.message : "Query failed" });
      return null;
    }
  },
}));
