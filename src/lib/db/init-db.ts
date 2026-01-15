import initSqlJs, { Database } from "sql.js";
import { CREATE_TABLES_SQL } from "./schema";
import { generateAllSampleData } from "./sample-data";
import { QueryResult, SqlValue } from "@/types/query";
import {
  SQLExecutionError,
  SQLErrorCode,
  parseSQLjsError,
} from "@/lib/db/sql-errors";

let db: Database | null = null;

/**
 * 데이터베이스 초기화
 */
export async function initDatabase(
  withSampleData: boolean = true
): Promise<Database> {
  if (db) {
    return db;
  }

  try {
    console.log(" SQL.js 초기화 시작...");

    // SQL.js 초기화
    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });

    // 데이터베이스 생성
    db = new SQL.Database();
    console.log("데이터베이스 인스턴스 생성 완료");

    // 테이블 생성
    db.run(CREATE_TABLES_SQL);
    console.log("테이블 생성 완료");

    // 샘플 데이터 삽입
    if (withSampleData) {
      const sampleData = generateAllSampleData();
      db.run(sampleData);
      console.log("샘플 데이터 삽입 완료");
    }

    return db;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw new Error(
      `데이터베이스 초기화에 실패했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
    );
  }
}

/**
 * 데이터베이스 인스턴스 가져오기
 */
export function getDatabase(): Database | null {
  return db;
}

/**
 * 데이터베이스 연결 해제
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log("데이터베이스 연결 해제");
  }
}

/**
 * 개선된 쿼리 실행 함수
 */
export async function executeQuery(sql: string): Promise<QueryResult> {
  // 데이터베이스 초기화 (없으면 자동 초기화)
  if (!db) {
    console.log("DB가 초기화되지 않음. 자동 초기화 실행...");
    await initDatabase(true);
  }

  if (!db) {
    throw new SQLExecutionError(
      "데이터베이스가 초기화되지 않았습니다.",
      SQLErrorCode.DATABASE
    );
  }

  // 빈 쿼리 체크
  if (!sql || sql.trim() === "") {
    throw new SQLExecutionError(
      "SQL 쿼리가 비어있습니다.",
      SQLErrorCode.VALIDATION
    );
  }

  // 실행 시간 측정 시작
  const startTime = performance.now();

  try {
    console.log("SQL 실행:", sql);

    // SQL 실행
    const result = db.exec(sql);

    // 실행 시간 측정
    const executionTime = performance.now() - startTime;

    // 결과가 없는 경우 (CREATE, INSERT 등)
    if (result.length === 0) {
      console.log("SQL 실행 완료 (결과 없음)", { executionTime });
      return {
        columns: [],
        values: [],
        rowCount: 0,
        // executionTime,
      };
    }

    // 첫 번째 결과 반환
    const { columns, values } = result[0];

    console.log("SQL 실행 완료", {
      columns,
      rowCount: values.length,
      executionTime: `${executionTime.toFixed(2)}ms`,
    });

    return {
      columns,
      values: values as SqlValue[][],
      rowCount: values.length,
      // executionTime,
    };
  } catch (error) {
    // 이미 SQLExecutionError인 경우 그대로 throw
    if (error instanceof SQLExecutionError) {
      throw error;
    }

    // 기타 예상치 못한 오류
    throw new SQLExecutionError(
      "예상치 못한 오류가 발생했습니다.",
      SQLErrorCode.RUNTIME,
      error instanceof Error ? error.message : String(error),
      error as Error
    );
  }
}
