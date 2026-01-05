import { QueryState } from "@/types/query";
import validateQueryState from "@/lib/query/validateQueryState";

/**
 * 빠른 검증 (에러 메시지 없이 boolean만 반환)
 *
 * @param state - 검증할 쿼리 상태
 * @returns 유효성 여부 (true/false)
 */
export function isQueryValid(state: QueryState): boolean {
  return validateQueryState(state).isValid;
}
