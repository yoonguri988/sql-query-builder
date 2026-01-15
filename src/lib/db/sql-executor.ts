import initSqlJs, { Database } from "sql.js";

// 싱글톤 패턴으로 DB 인스턴스 관리
let db: Database | null = null;

/**
 * SQL.js 데이터베이스 초기화
 * 1주차에 생성한 샘플 DB 파일 로드
 */
export async function initDatabase(): Promise<Database> {
  // 이미 초기화된 경우 재사용
  if (db) return db;

  try {
    // SQL.js 라이브러리 로드 (CDN)
    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });

    // 샘플 데이터베이스 파일 로드
    const response = await fetch("/sample-database.db");

    if (!response.ok) {
      throw new Error("샘플 데이터베이스 파일을 찾을 수 없습니다.");
    }

    const buffer = await response.arrayBuffer();

    // 데이터베이스 인스턴스 생성
    db = new SQL.Database(new Uint8Array(buffer));

    console.log("✅ SQL.js 데이터베이스 초기화 완료");

    return db;
  } catch (error) {
    console.error("❌ 데이터베이스 초기화 실패:", error);
    throw new Error(
      `데이터베이스 초기화 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
    );
  }
}

/**
 * SQL 쿼리 실행 결과 인터페이스
 */
export interface QueryResult {
  columns: string[]; // 컬럼명 배열
  values: any[][]; // 데이터 2차원 배열
  rowCount: number; // 결과 행 수
  executionTime: number; // 실행 시간 (ms)
}

/**
 * SQL 쿼리 실행
 *
 * @param sql - 실행할 SQL 쿼리
 * @returns QueryResult - 실행 결과
 */
export async function executeQuery(sql: string): Promise<QueryResult> {
  // 데이터베이스 초기화
  const database = await initDatabase();

  // 실행 시간 측정 시작
  const startTime = performance.now();

  try {
    // SQL 실행
    const result = database.exec(sql);

    // 실행 시간 측정 종료
    const executionTime = performance.now() - startTime;

    // 결과가 없는 경우 (예: CREATE, INSERT 등)
    if (result.length === 0) {
      return {
        columns: [],
        values: [],
        rowCount: 0,
        executionTime,
      };
    }

    // 첫 번째 결과 반환 (일반적으로 SELECT는 하나의 결과만)
    const [firstResult] = result;

    return {
      columns: firstResult.columns,
      values: firstResult.values,
      rowCount: firstResult.values.length,
      executionTime,
    };
  } catch (error) {
    console.error("❌ SQL 실행 오류:", error);
    throw new Error(
      `SQL 실행 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
    );
  }
}

/**
 * 데이터베이스 연결 해제 (필요시 사용)
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log("✅ 데이터베이스 연결 해제");
  }
}
