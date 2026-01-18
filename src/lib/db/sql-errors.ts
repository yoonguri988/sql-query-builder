/**
 * SQL 실행 에러 타입
 */
export enum SQLErrorCode {
  SYNTAX = "SYNTAX", // SQL 문법 오류
  RUNTIME = "RUNTIME", // 실행 중 오류
  DATABASE = "DATABASE", // 데이터베이스 연결 오류
  VALIDATION = "VALIDATION", // 유효성 검증 오류
  CONSTRAINT = "CONSTRAINT", // 제약조건 위반
  PERMISSION = "PERMISSION", // 권한 오류
}

/**
 * 커스텀 SQL 실행 에러
 */
export class SQLExecutionError extends Error {
  public code: SQLErrorCode;
  public details?: string;
  public originalError?: Error;

  constructor(
    message: string,
    code: SQLErrorCode,
    details?: string,
    originalError?: Error
  ) {
    super(message);
    this.name = "SQLExecutionError";
    this.code = code;
    this.details = details;
    this.originalError = originalError;

    // 스택 트레이스 유지
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SQLExecutionError);
    }
  }

  /**
   * 사용자 친화적인 에러 메시지 반환
   */
  getUserMessage(): string {
    switch (this.code) {
      case SQLErrorCode.SYNTAX:
        return `SQL 문법 오류: ${this.message}\n\n쿼리를 확인하고 다시 시도해주세요.`;

      case SQLErrorCode.RUNTIME:
        return `실행 오류: ${this.message}\n\n${this.details || "데이터베이스 상태를 확인해주세요."}`;

      case SQLErrorCode.DATABASE:
        return `데이터베이스 연결 오류: ${this.message}\n\n잠시 후 다시 시도해주세요.`;

      case SQLErrorCode.VALIDATION:
        return `입력 값 오류: ${this.message}`;

      case SQLErrorCode.CONSTRAINT:
        return `제약조건 위반: ${this.message}\n\n입력 값을 확인해주세요.`;

      case SQLErrorCode.PERMISSION:
        return `권한 오류: ${this.message}`;

      default:
        return `알 수 없는 오류: ${this.message}`;
    }
  }

  /**
   * 개발자용 상세 정보 반환
   */
  getDebugInfo(): string {
    const parts = [`[${this.code}] ${this.name}`, `Message: ${this.message}`];

    if (this.details) {
      parts.push(`Details: ${this.details}`);
    }

    if (this.originalError) {
      parts.push(`Original Error: ${this.originalError.message}`);
    }

    return parts.join("\n");
  }
}

/**
 * SQL.js 에러 메시지 파싱
 */
export function parseSQLjsError(error: Error): SQLExecutionError {
  const message = error.message.toLowerCase();

  // 문법 오류
  if (
    message.includes("syntax error") ||
    message.includes("near") ||
    message.includes("unexpected")
  ) {
    return new SQLExecutionError(
      "쿼리 문법에 오류가 있습니다.",
      SQLErrorCode.SYNTAX,
      error.message,
      error
    );
  }

  // 테이블/컬럼 없음
  if (message.includes("no such table") || message.includes("no such column")) {
    return new SQLExecutionError(
      "존재하지 않는 테이블 또는 컬럼입니다.",
      SQLErrorCode.SYNTAX,
      error.message,
      error
    );
  }

  // 제약조건 위반
  if (
    message.includes("constraint") ||
    message.includes("unique") ||
    message.includes("foreign key")
  ) {
    return new SQLExecutionError(
      "데이터 제약조건을 위반했습니다.",
      SQLErrorCode.CONSTRAINT,
      error.message,
      error
    );
  }

  // 기타 런타임 오류
  return new SQLExecutionError(
    "쿼리 실행 중 오류가 발생했습니다.",
    SQLErrorCode.RUNTIME,
    error.message,
    error
  );
}
