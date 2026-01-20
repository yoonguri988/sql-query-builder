import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableData } from "@/types/table";

/**
 * 쿼리 결과에서 동적으로 테이블 컬럼을 생성하는 커스텀 훅
 *
 * @param data - SQL 쿼리 실행 결과 데이터
 * @param columnNames - 명시적 컬럼명 배열 (선택)
 * @returns TanStack Table에서 사용할 ColumnDef 배열
 *
 * @example
 * ```tsx
 * const columns = useResultColumns(data, ['id', 'name', 'email']);
 * ```
 */
export default function useResultColumns(
  data: TableData[],
  columnNames?: string[]
): ColumnDef<TableData>[] {
  return useMemo(() => {
    // 데이터가 없으면 빈 배열 반환
    if (!data || data.length === 0) {
      return [];
    }

    // 컬럼명이 제공되면 사용, 아니면 첫 번째 행에서 추출
    const columns = columnNames || Object.keys(data[0]);

    // 각 컬럼 이름을 ColumnDef로 변환
    return columns.map((columnName) => ({
      // 컬럼의 고유 ID
      id: columnName,

      // 컬럼 헤더에 표시될 텍스트
      header: columnName,

      // 데이터 접근 키
      accessorKey: columnName,

      // 모든 컬럼 정렬 가능
      enableSorting: true,

      // 정렬 함수 최적화 (타입별 정렬)
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId);
        const b = rowB.getValue(columnId);

        // null/undefined 처리 (항상 맨 뒤로)
        if (a === null || a === undefined) return 1;
        if (b === null || b === undefined) return -1;

        // 숫자 비교
        if (typeof a === "number" && typeof b === "number") {
          return a - b;
        }

        // 불린 비교
        if (typeof a === "boolean" && typeof b === "boolean") {
          return a === b ? 0 : a ? -1 : 1;
        }

        // 문자열 비교 (대소문자 구분 없이)
        const aStr = String(a).toLowerCase();
        const bStr = String(b).toLowerCase();
        return aStr.localeCompare(bStr);
      },
    }));
  }, [data, columnNames]);
}
