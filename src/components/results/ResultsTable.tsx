"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { TableData } from "@/types/table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCellValue } from "@/lib/helper";
import { useQueryStore } from "@/store/query-store";
import useResultColumns from "@/hooks/useResultColumns";
import { useMemo } from "react";

/**
 * SQL 쿼리 결과를 표시하는 테이블 컴포넌트
 */
export function ResultsTable() {
  // 동적으로 컬럼 정의 생성
  const { queryResult, isExecuting, error } = useQueryStore();

  // SQL.js 결과를 객체 배열로 변환
  const data: TableData[] = useMemo(() => {
    if (!queryResult || !queryResult.values || !queryResult.columns) {
      return [];
    }
    // values 배열을 객체 배열로 변환
    return queryResult.values.map((row) => {
      const rowObject: TableData = {};
      queryResult.columns.forEach((columnName, index) => {
        rowObject[columnName] = row[index];
      });
      return rowObject;
    });
  }, [queryResult]);

  // 동적으로 컬럼 정의 생성
  const columns = useResultColumns(data, queryResult?.columns);

  // TanStack Table 인스턴스 생성
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 로딩 상태
  if (isExecuting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Executing query...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-lg font-medium">Query Error</p>
          <p className="text-sm mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // 빈 데이터 처리
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm mt-2">Execute a query to see results here</p>
        </div>
      </div>
    );
  }

  // 테이블 렌더링
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {formatCellValue(cell.getValue())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
