import { TableColumn } from "@/types/database";
import { Checkbox } from "@/components/ui/checkbox";
import { useCallback } from "react";

interface Props {
  column: TableColumn;
  isSelected: boolean;
  onToggle: (columnName: string) => void;
}

export default function ColumnSelectorItem({
  column,
  isSelected,
  onToggle,
}: Props) {
  // 개별 아이템의 토글 핸들러 메모이제이션
  const handleToggle = useCallback(() => {
    onToggle(column.name);
  }, [column.name, onToggle]);
  return (
    <div key={column.name} className="flex items-start space-x-3">
      <Checkbox
        id={`column-${column.name}`}
        checked={isSelected}
        onCheckedChange={handleToggle}
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
}
