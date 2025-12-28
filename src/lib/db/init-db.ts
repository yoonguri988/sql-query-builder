import initSqlJs, { Database } from "sql.js";
import { CREATE_TABLES_SQL } from "./schema";

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (db) {
    return db;
  }
  try {
    // SQL.js 초기화
    const SQL = await initSqlJs({
      locateFile: (/*file*/) => `/sql-wasm.wasm`,
    });

    // 새 데이터베이스 생성
    db = new SQL.Database();

    // 테이블 생성
    db.run(CREATE_TABLES_SQL);

    console.log("✅ Database initialized successfully");
    return db;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

export function getDatabase(): Database | null {
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log("Database closed");
  }
}
