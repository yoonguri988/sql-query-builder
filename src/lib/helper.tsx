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
 */
export function formatCellValue(value: CellValue) {
  // null/undefined 처리
  if (value === null || value === undefined) {
    return <span className="text-gray-400 italic">NULL</span>;
  }

  // Uint8Array (BLOB) 처리
  if (value instanceof Uint8Array) {
    const hexString = uint8ArrayToHex(value);
    const preview =
      hexString.length > 50 ? hexString.substring(0, 50) + "..." : hexString;

    return (
      <span className="text-purple-600 font-mono text-xs" title={hexString}>
        BLOB ({value.length} bytes): {preview}
      </span>
    );
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
