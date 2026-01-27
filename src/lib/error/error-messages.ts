/**
 * error-messages.ts
 * - 에러 타입별 친화적인 메시지 제공
 * - title, description, suggestion 구조
 * - 6가지 에러 타입 지원
 */

export interface SQLErrorInfo {
  title: string;
  description: string;
  suggestion: string;
}

export function getSQLErrorMessage(error: Error): SQLErrorInfo {
  const message = error.message.toLowerCase();

  if (message.includes("no such table")) {
    return {
      title: "테이블을 찾을 수 없습니다",
      description: "지정한 테이블이 데이터베이스에 존재하지 않습니다.",
      suggestion: "왼쪽 사이드바에서 올바른 테이블을 선택해주세요.",
    };
  }

  if (message.includes("no such column")) {
    return {
      title: "컬럼을 찾을 수 없습니다",
      description: "지정한 컬럼이 테이블에 존재하지 않습니다.",
      suggestion: "선택한 컬럼 목록을 확인해주세요.",
    };
  }

  if (message.includes("syntax error")) {
    return {
      title: "SQL 문법 오류",
      description: "SQL 쿼리 문법에 오류가 있습니다.",
      suggestion: "SQL 문법을 확인하거나 Query Builder를 사용해보세요.",
    };
  }

  if (message.includes("ambiguous column")) {
    return {
      title: "모호한 컬럼 참조",
      description: "동일한 이름의 컬럼이 여러 테이블에 존재합니다.",
      suggestion: "테이블명을 명시하거나 별칭을 사용해주세요.",
    };
  }

  if (message.includes("constraint")) {
    return {
      title: "제약 조건 위반",
      description: "데이터베이스 제약 조건을 위반했습니다.",
      suggestion: "PRIMARY KEY, FOREIGN KEY, UNIQUE 제약 조건을 확인해주세요.",
    };
  }

  if (message.includes("datatype mismatch")) {
    return {
      title: "데이터 타입 불일치",
      description: "컬럼의 데이터 타입과 입력 값이 일치하지 않습니다.",
      suggestion:
        "숫자 컬럼에는 숫자를, 텍스트 컬럼에는 문자열을 사용해주세요.",
    };
  }

  return {
    title: "쿼리 실행 오류",
    description: error.message,
    suggestion: "SQL 쿼리를 확인하고 다시 시도해주세요.",
  };
}
