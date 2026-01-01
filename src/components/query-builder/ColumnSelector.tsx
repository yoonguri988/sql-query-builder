import useTableColumns, { useColumnNames } from "@/hooks/useTableColumns";
import { useQueryStore } from "@/store/query-store";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Columns3, Square } from "lucide-react";

/** Column Selector 컴포넌트
 * SELECT 절에서 사용할 컬럼을 선택하는 Multi-CheckBox
 *
 * 기능
 * - 선택된 테이블의 컬럼을 목록으로 표시
 * - checkbox로 다중 선택
 * - 전체 선택, 전체 해제
 * - 선택된 컬럼 개수 표시
 * - 선택된 컬럼에 따른 SQL 자동 업데이트
 *
 * @component
 * @example
 * <ColumnSelector />
 */
export default function ColumnSelector() {
  const {
    selectedTable,
    selectedColumns,
    toggleColumn,
    selectAllColumns,
    deselectAllColumns,
  } = useQueryStore();

  const columns = useTableColumns();
  const columnsNames = useColumnNames();

  // 테이블이 선택 되지 않았다면?
  if (!selectedTable) {
    return (
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Columns3 className="h-4 w-4" />
          SELECT
        </Label>
        <div className="text-sm text-muted-foreground">
          먼저 테이블을 선택하세요
        </div>
      </div>
    );
  }

  const isAllSelected =
    selectedColumns.length === columnsNames.length && columnsNames.length > 0;
  // const isSomeSelected =
  //   selectedColumns.length > 0 && selectedColumns.length < columnsNames.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      deselectAllColumns();
    } else {
      selectAllColumns(columnsNames);
    }
  };

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Columns3 className="h-4 w-4" />
          SELECT
        </Label>

        {/* 전체 선택/해제 버튼 */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleToggleAll}
          className="h-8 text-xs"
        >
          {isAllSelected ? (
            <>
              <Square className="h-3 w-3 mr-1" />
              전체 해제
            </>
          ) : (
            <>
              <CheckSquare className="h-3 w-3 mr-1" />
              전체 선택
            </>
          )}
        </Button>
      </div>

      {/* 선택된 컬럼 개수 표시 */}
      <div className="text-xs text-muted-foreground">
        {selectedColumns.length === 0 ? (
          <span>선택된 컬럼 없음 (SELECT * 사용)</span>
        ) : (
          <span>
            선택된 컬럼:{" "}
            <span className="font-semibold text-foreground">
              {selectedColumns.length}
            </span>{" "}
            / {columnsNames.length}
          </span>
        )}
      </div>

      {/* 컬럼 체크박스 목록 */}
      <div className="rounded-md border p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {columns.map((column) => {
          const isChecked = selectedColumns.includes(column.name);

          return (
            <div key={column.name} className="flex items-start space-x-3">
              <Checkbox
                id={`column-${column.name}`}
                checked={isChecked}
                onCheckedChange={() => toggleColumn(column.name)}
              />
              <div className="grid gap-1.5 leading-none flex-1">
                <label
                  htmlFor={`column-${column.name}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 flex-wrap"
                >
                  <span className="font-mono">{column.name}</span>
                  <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                    {column.type}
                  </span>
                  {column.primaryKey && (
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded font-medium">
                      PK
                    </span>
                  )}
                  {column.foreignKey && (
                    <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded font-medium">
                      FK
                    </span>
                  )}
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* 안내 메시지 */}
      {selectedColumns.length === 0 && (
        <p className="text-xs text-muted-foreground">
          💡 컬럼을 선택하지 않으면 모든 컬럼(*)이 선택됩니다.
        </p>
      )}
    </div>
  );
}
