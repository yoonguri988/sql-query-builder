"use client";

import { CellValue } from "@/types/table";

/**
 * Uint8Array를 16진수 문자열로 변환
 */
function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ")
    .toUpperCase();
}

/**
 * 셀 값을 포맷팅하고 스타일을 적용하는 헬퍼 함수
 * 데이터 타입에 따라 적절한 시각적 표현을 제공합니다.
 */
export function formatCellValue(value: CellValue) {
  // null/undefined 처리
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground italic text-xs">NULL</span>;
  }

  // Uint8Array (BLOB) 처리
  if (value instanceof Uint8Array) {
    const hexString = uint8ArrayToHex(value);
    // const preview =
    // hexString.length > 50 ? hexString.substring(0, 50) + "..." : hexString;

    return (
      <span
        className="text-purple-600 dark:text-purple-400 font-mono text-xs bg-purple-50 dark:bg-purple-950/30 px-2 py-1 rounded"
        title={`BLOB (${value.length} bytes): ${hexString}`}
      >
        BLOB ({value.length}b)
      </span>
    );
  }

  // 숫자 타입 처리 (우측 정렬은 TableCell에서 처리)
  if (typeof value === "number") {
    return (
      <span className="font-mono tabular-nums">{value.toLocaleString()}</span>
    );
  }

  // 불린 타입 처리
  if (typeof value === "boolean") {
    return (
      <span
        className={
          value
            ? "text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded text-xs"
            : "text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded text-xs"
        }
      >
        {value ? "TRUE" : "FALSE"}
      </span>
    );
  }

  // 문자열 기본 처리
  const stringValue = String(value);

  // 긴 문자열은 말줄임표 처리
  if (stringValue.length > 100) {
    return (
      <span className="block truncate max-w-md" title={stringValue}>
        {stringValue}
      </span>
    );
  }

  return <span>{stringValue}</span>;
}
