import { WhereCondition } from "@/types/query";
import { ValidationError } from "@/types/validation";

/**
 * 개별 WHERE 조건 검증
 *
 * @param condition - 검증할 조건
 * @param index - 조건의 인덱스 (에러 메시지용)
 * @returns 발견된 에러 목록
 */
export default function validateWhereCondition(
  condition: WhereCondition,
  index: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  // 컬럼 검증
  if (!condition.column || condition.column.trim() === "") {
    errors.push({
      field: `whereConditions[${index}].column`,
      message: `WHERE 조건 ${index + 1}: 컬럼을 선택해주세요.`,
    });
  }

  // 값 검증 (IS NULL, IS NOT NULL 제외)
  if (
    condition.operator !== "IS NULL" &&
    condition.operator !== "IS NOT NULL"
  ) {
    const valueStr = String(condition.value);
    if (!valueStr || valueStr.trim() === "") {
      errors.push({
        field: `whereConditions[${index}].value`,
        message: `WHERE 조건 ${index + 1}: 값을 입력해주세요.`,
      });
    }
  }

  // IN 연산자 특별 검증 (선택사항)
  if (condition.operator === "IN") {
    const valueStr = String(condition.value);
    if (valueStr && !valueStr.trim()) {
      errors.push({
        field: `whereConditions[${index}].value`,
        message: `WHERE 조건 ${index + 1}: IN 절에 값을 입력해주세요.`,
      });
    }
  }

  return errors;
}
