import initSqlJs, { Database } from "sql.js";
import { CREATE_TABLES_SQL } from "./schema";
import { generateAllSampleData } from "./sample-data";
import { QueryResult, SqlValue } from "@/types/query";

let db: Database | null = null;

export async function initDatabase(
  withSampleData: boolean = true
): Promise<Database> {
  if (db) {
    return db;
  }
  try {
    // SQL.js 초기화
    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
      /* locateFile: (file) => `/sql-wasm.wasm`, */
    });

    // 데이터베이스 생성
    db = new SQL.Database();

    // 테이블 생성
    db.run(CREATE_TABLES_SQL);

    // 샘플 데이터 삽입
    if (withSampleData) {
      const sampleData = generateAllSampleData();
      db.run(sampleData);
    }

    return db;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw new Error("데이터베이스 초기화에 실패했습니다.");
  }
}

export function getDatabase(): Database | null {
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * 쿼리 실행
 */
export function executeQuery(sql: string): QueryResult {
  if (!db) {
    throw new Error("데이터베이스가 초기화되지 않았습니다.");
  }

  try {
    const result = db.exec(sql);

    if (result.length === 0) {
      return { columns: [], values: [], rowCount: 0 };
    }

    const { columns, values } = result[0];

    return { columns, values: values as SqlValue[][], rowCount: values.length };
  } catch (error) {
    throw error;
  }
}
