import initSqlJs, { Database } from "sql.js";
import { CREATE_TABLES_SQL } from "./schema";
import { generateAllSampleData } from "./sample-data";
import {
  ExecutionMetadata,
  ExecutionResult,
  QueryResult,
  SqlValue,
  TransformedQueryResult,
} from "@/types/query";
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
    // SQL.js 초기화
    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
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
  }
}

/**
 * QueryResult를 TransformedQueryResult로 변환
 */
function transformQueryResult(result: QueryResult): TransformedQueryResult {
  const { columns, values, rowCount } = result;

  // 빈 결과 처리
  if (columns.length === 0 || values.length === 0) {
    return {
      columns: [],
      data: [],
      rowCount: 0,
    };
  }

  // 배열 데이터를 객체 배열로 변환
  const data = values.map((row) => {
    const obj: Record<string, SqlValue> = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });

  return {
    columns,
    data,
    rowCount,
  };
}

export async function executeQueryWithMetadata(
  sql: string
): Promise<ExecutionResult> {
  const startTime = performance.now();

  // 빈 쿼리 체크
  if (!sql || sql.trim() === "") {
    const executionTime = Math.round(performance.now() - startTime);

    throw new SQLExecutionError(
      "SQL 쿼리가 비어있습니다.",
      SQLErrorCode.VALIDATION
    );
  }

  try {
    // 데이터베이스 가져오기
    const database = getDatabase();

    if (!database) {
      const executionTime = Math.round(performance.now() - startTime);

      throw new SQLExecutionError(
        "데이터베이스가 초기화되지 않았습니다.",
        SQLErrorCode.DATABASE
      );
    }

    // 쿼리 실행
    let result;
    try {
      result = database.exec(sql);
    } catch (sqlError) {
      // SQL.js 에러를 커스텀 에러로 변환
      const executionTime = Math.round(performance.now() - startTime);
      throw parseSQLjsError(sqlError as Error);
    }

    // 실행 시간 계산
    const executionTime = Math.round(performance.now() - startTime);

    // 결과 처리 - 결과 없음
    if (!result || result.length === 0) {
      const rawResult: QueryResult = {
        columns: [],
        values: [],
        rowCount: 0,
      };

      const transformedData = transformQueryResult(rawResult);

      const metadata: ExecutionMetadata = {
        executionTime,
        rowCount: 0,
        status: "success",
        timestamp: new Date(),
      };

      return {
        data: transformedData,
        metadata,
      };
    }

    // 첫 번째 결과 추출
    const [firstResult] = result;

    const rawResult: QueryResult = {
      columns: firstResult.columns,
      values: firstResult.values as SqlValue[][],
      rowCount: firstResult.values.length,
    };

    // 데이터 변환
    const transformedData = transformQueryResult(rawResult);

    // 메타데이터 생성
    const metadata: ExecutionMetadata = {
      executionTime,
      rowCount: transformedData.rowCount,
      status: "success",
      timestamp: new Date(),
    };

    console.log(
      `쿼리 실행 성공: ${transformedData.rowCount}행, ${executionTime}ms`
    );

    return {
      data: transformedData,
      metadata,
    };
  } catch (error) {
    const executionTime = Math.round(performance.now() - startTime);

    // 이미 SQLExecutionError인 경우
    if (error instanceof SQLExecutionError) {
      const metadata: ExecutionMetadata = {
        executionTime,
        rowCount: 0,
        status: "error",
        error: error.message,
        timestamp: new Date(),
      };

      console.error(`쿼리 실행 실패: ${error.message} (${executionTime}ms)`);

      return {
        data: { columns: [], data: [], rowCount: 0 },
        metadata,
      };
    }

    // 기타 예상치 못한 오류
    const errorMessage =
      error instanceof Error
        ? error.message
        : "예상치 못한 오류가 발생했습니다.";

    const metadata: ExecutionMetadata = {
      executionTime,
      rowCount: 0,
      status: "error",
      error: errorMessage,
      timestamp: new Date(),
    };

    console.error(`예상치 못한 오류: ${errorMessage} (${executionTime}ms)`);

    return {
      data: { columns: [], data: [], rowCount: 0 },
      metadata,
    };
  }
}

/**
 * 쿼리 실행 함수 [하위 호환성]
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
