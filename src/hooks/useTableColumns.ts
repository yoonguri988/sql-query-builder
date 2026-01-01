/**
 * 260101 useTableColumns
 * - 선택된 테이블의 컬럼 정보를 가져오는 hook
 * - useMemo를 통해 성능 최적화
 */

import { useQueryStore } from "@/store/query-store";
import { getTableColumns } from "@/types/schema";
import { useMemo } from "react";

/**
 * @return {TableColumn[]} 현재 선택된 테이블의 컬럼 정보 목록
 */
export default function useTableColumns() {
  const selectedTable = useQueryStore((state) => state.selectedTable);

  const columns = useMemo(() => {
    if (!selectedTable) return [];
    return getTableColumns(selectedTable);
  }, [selectedTable]);

  return columns;
}

/** 컬럼명 목록만 가져오는 훅
 * @returns {string[]} 컬럼명 배열 */
export function useColumnNames(): string[] {
  const columns = useTableColumns();
  return useMemo(() => columns.map((col) => col.name), [columns]);
}
