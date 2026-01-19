"use client";

/**
 * 셀 값을 포맷팅하고 스타일을 적용하는 헬퍼 함수
 */
export function formatCellValue(value: any) {
  // null/undefined 처리
  if (value === null || value === undefined) {
    return <span className="text-gray-400 italic">NULL</span>;
  }

  // 숫자 타입 처리 (우측 정렬)
  if (typeof value === "number") {
    return <span className="text-right block font-mono">{value}</span>;
  }

  // 불린 타입 처리
  if (typeof value === "boolean") {
    return (
      <span
        className={
          value ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
        }
      >
        {value ? "TRUE" : "FALSE"}
      </span>
    );
  }

  // 문자열 기본 처리
  return <span>{String(value)}</span>;
}
