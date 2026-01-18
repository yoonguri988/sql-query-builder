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
  // 빈 쿼리 체크
  if (!sql || sql.trim() === "") {
    throw new SQLExecutionError(
      "SQL 쿼리가 비어있습니다.",
      SQLErrorCode.VALIDATION
    );
  }

  // 데이터베이스 초기화
  try {
    // db 가져오기
    const database = await getDatabase();
    if (!database) {
      throw new SQLExecutionError(
        "데이터베이스를 초기화할 수 없습니다.",
        SQLErrorCode.DATABASE
      );
    }

    // 쿼리 실행 - 시간 측정
    // const startTime = performance.now();
    let result;
    try {
      result = database.exec(sql);
    } catch (sqlError) {
      // SQL.js 에러를 커스텀 에러로 변환
      throw parseSQLjsError(sqlError as Error);
    }

    // 쿼리 실행 - 시간 측정
    // const executionTime = performance.now() - startTime;

    // 결과 처리 - 결과 없음
    if (!result || result.length === 0) {
      return {
        columns: [],
        values: [],
        rowCount: 0,
      };
    }

    const [firstResult] = result;

    return {
      columns: firstResult.columns,
      values: firstResult.values as SqlValue[][],
      rowCount: firstResult.values.length,
    };
  } catch (e) {
    // 이미 SQLExecutionError인 경우 그대로 throw
    if (e instanceof SQLExecutionError) {
      throw e;
    }
    // 기타 예상치 못한 오류
    throw new SQLExecutionError(
      "예상치 못한 오류가 발생했습니다.",
      SQLErrorCode.RUNTIME,
      e instanceof Error ? e.message : String(e),
      e as Error
    );
  }
}
