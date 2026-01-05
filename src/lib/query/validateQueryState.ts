import { QueryState } from "@/types/query";
import { ValidationError, ValidationResult } from "@/types/validation";
import validateWhereCondition from "@/lib/query/validateWhereCondition";

/**
 * QueryState 전체 검증
 *
 * @param state - 검증할 쿼리 상태
 * @returns 검증 결과 (isValid, errors)
 */
export default function validateQueryState(
  state: QueryState
): ValidationResult {
  const errors: ValidationError[] = [];

  // 1. 테이블 검증
  if (!state.selectedTable || state.selectedTable.trim() === "") {
    errors.push({
      field: "selectedTable",
      message: "FROM 절: 테이블을 선택해주세요.",
    });
  }

  // 2. 컬럼 검증은 불필요 (빈 배열이면 SELECT * 생성)

  // 3. WHERE 조건 검증
  state.whereConditions.forEach((condition, index) => {
    const conditionErrors = validateWhereCondition(condition, index);
    errors.push(...conditionErrors);
  });

  // 4. ORDER BY 검증
  state.orderBy.forEach((order, index) => {
    if (!order.column || order.column.trim() === "") {
      errors.push({
        field: `orderBy[${index}].column`,
        message: `ORDER BY ${index + 1}: 정렬 컬럼을 선택해주세요.`,
      });
    }
  });

  // 5. LIMIT 검증
  if (state.limit !== null && state.limit !== undefined) {
    if (state.limit < 0) {
      errors.push({
        field: "limit",
        message: "LIMIT: 0 이상의 값을 입력해주세요.",
      });
    }
    if (state.limit > 10000) {
      errors.push({
        field: "limit",
        message: "LIMIT: 10000 이하의 값을 입력해주세요. (성능 보호)",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
