import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { TableData } from "@/types/table";

/**
 * 페이지네이션 컨트롤 컴포넌트
 * - 페이지 정보 표시
 * - 페이지 크기 선택
 * - 페이지 이동 버튼 (처음, 이전, 다음, 마지막)
 */
interface PaginationControlsProps {
  table: Table<TableData>;
}

export default function PaginationControls({ table }: PaginationControlsProps) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();

  return (
    <div className="flex flex-col gap-4 px-4 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
      {/* 좌측: 행 개수 정보 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* 페이지 크기 선택 */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="rows-per-page"
            className="text-sm font-medium text-muted-foreground whitespace-nowrap"
          >
            페이지에서 보일 개수:
          </label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger
              id="rows-per-page"
              className="h-8 w-[70px] focus:ring-2 focus:ring-primary"
              aria-label="Select rows per page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((size) => (
                <SelectItem
                  key={size}
                  value={`${size}`}
                  className="cursor-pointer"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 우측: 페이지 네비게이션 */}
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        {/* 페이지 번호 표시 */}
        <div className="flex items-center justify-center min-w-[100px] text-sm font-medium text-muted-foreground mr-2">
          페이지 <span className="mx-1 text-foreground">{pageIndex + 1}</span> /{" "}
          <span className="ml-1 text-foreground">{pageCount}</span>
        </div>

        {/* 이동 버튼 그룹 */}
        <div className="flex items-center gap-1">
          {/* 첫 페이지로 */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 transition-all disabled:opacity-50"
            aria-label="Go to first page"
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* 이전 페이지 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 gap-1 transition-all disabled:opacity-50 hidden sm:flex"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden md:inline">이전</span>
          </Button>

          {/* 이전 페이지 (모바일) */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 transition-all disabled:opacity-50 sm:hidden"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* 다음 페이지 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 gap-1 transition-all disabled:opacity-50 hidden sm:flex"
            aria-label="Go to next page"
          >
            <span className="hidden md:inline">다음</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* 다음 페이지 (모바일) */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 transition-all disabled:opacity-50 sm:hidden"
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* 마지막 페이지로 */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 transition-all disabled:opacity-50"
            aria-label="Go to last page"
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
