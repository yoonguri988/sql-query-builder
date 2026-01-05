/**
 * 검증 에러 타입
 */
export interface ValidationError {
  field: string; // 에러가 발생한 필드 (예: 'whereConditions[0].value')
  message: string; // 사용자에게 보여줄 메시지
}

/**
 * 검증 결과 타입
 */
export interface ValidationResult {
  isValid: boolean; // 전체 검증 통과 여부
  errors: ValidationError[]; // 발견된 에러 목록
}
