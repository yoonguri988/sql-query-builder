import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableData } from "@/types/table";

/**
 * 쿼리 결과에서 동적으로 테이블 컬럼을 생성하는 커스텀 훅
 *
 * @param data - SQL 쿼리 실행 결과 데이터
 * @returns TanStack Table에서 사용할 ColumnDef 배열
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
    }));
  }, [data, columnNames]);
}
