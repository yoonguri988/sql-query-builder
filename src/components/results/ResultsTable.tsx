"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { CellValue, TableData } from "@/types/table";
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
import { useMemo, useState } from "react";
import SortingIcon from "./SortingIcon";
import PaginationControls from "./PaginationControls";
import { cn } from "@/lib/utils";
import LoadingResults from "@/components/results/LoadingResults";
import ErrorResults from "@/components/results/ErrorResults";
import EmptyResults from "@/components/results/EmptyResults";

/**
 * SQL 쿼리 결과를 표시하는 테이블 컴포넌트
 */
export default function ResultsTable() {
  // 정렬 상태 관리
  const [sorting, setSorting] = useState<SortingState>([]);
  // 페이지네이션 상태
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // 첫 페이지
    pageSize: 10, // 기본 10개씩
  });
  // 선택 상태
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

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
    // 정렬 관련 설정
    state: {
      sorting,
      pagination,
    },
    onSortingChange: (updater) => {
      setSorting(updater);
      table.setPageIndex(0); // 정렬 변경 시 첫 페이지로
    },
    onPaginationChange: setPagination, // 페이지네이션 핸들러
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // 정렬 모델 활성화
    getPaginationRowModel: getPaginationRowModel(), // 페이지네이션 모델 활성화
  });

  // 로딩 상태
  if (isExecuting) return <LoadingResults />;
  // 에러 상태
  if (error) return <ErrorResults error={error} />;
  // 빈 데이터 처리
  if (!data || data.length === 0) return <EmptyResults />;

  // 테이블 렌더링
  return (
    <div className="w-full h-full flex flex-col">
      {/* 스크롤 가능한 테이블 컨테이너 */}
      <div className="flex-1 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-420px)]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-foreground h-12 px-4 relative group"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          className={cn(
                            header.column.getCanSort()
                              ? "flex items-center gap-2 cursor-pointer select-none hover:text-primary transition-colors"
                              : "flex items-center gap-2"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          role={
                            header.column.getCanSort() ? "button" : undefined
                          }
                          aria-label={
                            header.column.getCanSort()
                              ? `Sort by ${header.column.columnDef.header}`
                              : undefined
                          }
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.toggleSorting();
                            }
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <SortingIcon
                              isSorted={header.column.getIsSorted()}
                            />
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    const newSelected = new Set(selectedRows);
                    if (newSelected.has(row.id)) {
                      newSelected.delete(row.id);
                    } else {
                      newSelected.add(row.id);
                    }
                    setSelectedRows(newSelected);
                  }}
                  className={cn(
                    // 기본 스타일
                    "border-b border-border/50 transition-all duration-150 cursor-default",
                    // Zebra Striping - 짝수/홀수 행 구분
                    row.index % 2 === 0 ? "bg-background" : "bg-muted/20",
                    // Hover 효과 - 마우스 오버 시 강조 + 미묘한 그림자
                    "hover:bg-muted/50 hover:shadow-[inset_0_1px_0_0_rgba(0,0,0,0.05)]",
                    // 선택된 행 스타일
                    selectedRows.has(row.id) &&
                      "bg-primary/5 border-l-4 border-l-primary hover:bg-primary/10"
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const value = cell.getValue() as CellValue;

                    // 데이터 타입 확인
                    const isNumber = typeof value === "number";
                    const isNull = value === null || value === undefined;
                    const isBoolean = typeof value === "boolean";
                    const isBlob = value instanceof Uint8Array;
                    const isFirstColumn = cell.column.getIndex() === 0;

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          // 기본 패딩 및 크기
                          "px-4 py-3 text-sm",
                          // 부드러운 트랜지션
                          "transition-colors duration-150",

                          // 데이터 타입별 정렬
                          isNumber && "text-right font-mono tabular-nums",
                          !isNumber &&
                            !isNull &&
                            !isBoolean &&
                            !isBlob &&
                            "text-left",

                          // NULL 값은 중앙 정렬
                          isNull && "text-center",

                          // Boolean과 BLOB는 중앙 정렬
                          (isBoolean || isBlob) && "text-center",

                          // 첫 번째 컬럼 강조 (보통 ID나 Primary Key)
                          isFirstColumn && "font-medium text-foreground/90",

                          // 긴 텍스트 처리
                          !isNumber &&
                            !isBoolean &&
                            !isBlob &&
                            !isNull &&
                            "max-w-md truncate" // 긴 텍스트 자동 말줄임
                        )}
                        title={
                          // 말줄임표 처리된 경우 전체 내용을 툴팁으로 표시
                          !isNumber &&
                          !isBoolean &&
                          !isBlob &&
                          !isNull &&
                          typeof value === "string" &&
                          value.length > 50
                            ? String(value)
                            : undefined
                        }
                      >
                        {formatCellValue(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <PaginationControls table={table} />
    </div>
  );
}
