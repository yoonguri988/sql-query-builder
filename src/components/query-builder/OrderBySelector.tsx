import { ArrowDown, ArrowUp, ArrowUpDown, Plus, X } from "lucide-react";
import { useColumnNames } from "@/hooks/useTableColumns";
import { useQueryStore } from "@/store/query-store";
import { OrderByClause } from "@/types/query";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

/** OrderBySelector 컴포넌트
 * ORDER BY 절을 관리하는 선택기
 *
 * 기능:
 * - 정렬 컬럼 선택
 * - ASC/DESC 토글
 * - 다중 정렬 지원
 * - 정렬 순서 삭제
 *
 * @component
 */
export default function OrderBySelector() {
  const { selectedTable, orderBy, addOrderBy, updateOrderBy, removeOrderBy } =
    useQueryStore();

  const columnNames = useColumnNames();

  // 테이블이 선택되지 않았을 때
  if (!selectedTable) {
    return (
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ArrowUpDown className="h-4 w-4" />
          ORDER BY
        </Label>
        <div className="text-sm text-muted-foreground">
          먼저 테이블을 선택하세요
        </div>
      </div>
    );
  }

  // 새 정렬 추가
  const handleAddSort = () => {
    const newSort: OrderByClause = {
      id: `sort-${Date.now()}`,
      column: columnNames[0] || "",
      direction: "ASC",
    };
    addOrderBy(newSort);
  };

  // 방향 토글
  const toggleDirection = (id: string, currentDirection: "ASC" | "DESC") => {
    updateOrderBy(id, {
      direction: currentDirection === "ASC" ? "DESC" : "ASC",
    });
  };

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <ArrowUpDown className="h-4 w-4" />
          ORDER BY
        </Label>

        {/* 정렬 추가 버튼 */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddSort}
          className="h-8 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          정렬 추가
        </Button>
      </div>

      {/* 정렬 개수 표시 */}
      <div className="text-xs text-muted-foreground">
        {orderBy.length === 0 ? (
          <span>정렬 없음 (기본 순서)</span>
        ) : (
          <span>
            정렬{" "}
            <span className="font-semibold text-foreground">
              {orderBy.length}
            </span>
            개
          </span>
        )}
      </div>

      {/* 정렬 목록 */}
      {orderBy.length > 0 && (
        <div className="rounded-md border p-4 space-y-3">
          {orderBy.map((sort, index) => (
            <div key={sort.id} className="flex items-center gap-2">
              {/* 순서 표시 */}
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                {index + 1}
              </div>

              {/* 컬럼 선택 */}
              <Select
                value={sort.column}
                onValueChange={(value) =>
                  updateOrderBy(sort.id, { column: value })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="컬럼 선택" />
                </SelectTrigger>
                <SelectContent>
                  {columnNames.map((columnName) => (
                    <SelectItem key={columnName} value={columnName}>
                      <span className="font-mono text-sm">{columnName}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* ASC/DESC 토글 버튼 */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleDirection(sort.id, sort.direction)}
                className="h-10 w-24"
              >
                {sort.direction === "ASC" ? (
                  <>
                    <ArrowUp className="h-4 w-4 mr-1" />
                    ASC
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-4 w-4 mr-1" />
                    DESC
                  </>
                )}
              </Button>

              {/* 삭제 버튼 */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOrderBy(sort.id)}
                className="h-10 w-10 shrink-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                title="정렬 삭제"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* 안내 메시지 */}
      {orderBy.length === 0 && (
        <div className="rounded-md border border-dashed p-6 text-center">
          <ArrowUpDown className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground mb-2">
            정렬 조건이 없습니다
          </p>
          <p className="text-xs text-muted-foreground">
            💡 [정렬 추가] 버튼을 클릭하여 결과를 정렬하세요
          </p>
        </div>
      )}

      {/* 사용 팁 */}
      {orderBy.length > 0 && (
        <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 rounded p-2">
          💡 팁: 첫 번째 정렬이 우선 적용되고, 같은 값일 경우 다음 정렬이
          적용됩니다.
        </div>
      )}
    </div>
  );
}
