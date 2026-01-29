import useTableColumns, { useColumnNames } from "@/hooks/useTableColumns";
import { useQueryStore } from "@/store/query-store";
import { Label } from "@/components/ui/label";
import { Columns3 } from "lucide-react";
import HintMessage from "@/components/query-builder/HintMessage";
import EmptyState from "@/components/query-builder/EmptyState";
import ColumnCountInfo from "./ColumnCountInfo";
import { useMemo } from "react";
import ColumnSelectorItem from "./ColumnSelectorItem";
import AllSelectedButton from "./AllSelectedButton";

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
  const selectedTable = useQueryStore((state) => state.selectedTable);
  const selectedColumns = useQueryStore((state) => state.selectedColumns);
  const toggleColumn = useQueryStore((state) => state.toggleColumn);
  const selectAllColumns = useQueryStore((state) => state.selectAllColumns);
  const deselectAllColumns = useQueryStore((state) => state.deselectAllColumns);

  const columns = useTableColumns();
  const columnsNames = useColumnNames();

  // 계산값 메모이제이션
  const isAllSelected = useMemo(() => {
    return (
      selectedColumns.length > 0 ||
      (selectedColumns.length === columnsNames.length &&
        columnsNames.length > 0)
    );
  }, [selectedColumns.length, columnsNames.length]);

  const selectedCount = useMemo(() => {
    return selectedColumns.length;
  }, [selectedColumns.length]);

  const handleToggleAll = () => {
    if (isAllSelected) {
      deselectAllColumns();
    } else {
      selectAllColumns(columnsNames);
    }
  };

  /* 빈 상태 */
  if (!selectedTable) return <EmptyState />;

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Columns3 className="h-4 w-4" />
          SELECT
        </Label>

        {/* 전체 선택/해제 버튼 */}
        <AllSelectedButton value={isAllSelected} onToggle={handleToggleAll} />
      </div>

      {/* 카운트 정보 */}
      <div className="text-xs text-muted-foreground">
        <ColumnCountInfo
          selectedCount={selectedCount}
          totalCount={columnsNames.length}
        />
      </div>

      {/* 컬럼 목록 */}
      {/* 컬럼 체크박스 목록 */}
      <div className="rounded-md border p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {columns.map((column) => (
          <ColumnSelectorItem
            key={column.name}
            column={column}
            isSelected={selectedColumns.includes(column.name)}
            onToggle={toggleColumn}
          />
        ))}
      </div>

      {/* 안내 메시지 */}
      {selectedColumns.length === 0 && (
        <HintMessage
          msg={`컬럼을 선택하지 않으면 모든 컬럼(*)이 선택됩니다.`}
        />
      )}
    </div>
  );
}
