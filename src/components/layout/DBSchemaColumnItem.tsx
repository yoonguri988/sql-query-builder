import { memo } from "react";
import { TableColumn } from "@/types/database";
import { Columns } from "lucide-react";

interface Props {
  column: TableColumn;
  isSelected: boolean;
  onClick: (name: string) => void;
}

function DBSchemaColumnItem({ column, isSelected, onClick }: Props) {
  return (
    <div
      className={`flex items-start gap-2 py-1 px-2 rounded cursor-pointer text-sm ${isSelected ? "bg-primary/20 hover:bg-primary/30" : "hover:bg-accent"}`}
      onDoubleClick={() => onClick(column.name)}
      title="Double-click to add to SELECT"
    >
      <Columns className="h-3 w-3 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-mono text-xs">{column.name}</div>
        <div className="text-xs text-muted-foreground">{column.type}</div>
      </div>
    </div>
  );
}
export default memo(DBSchemaColumnItem);
