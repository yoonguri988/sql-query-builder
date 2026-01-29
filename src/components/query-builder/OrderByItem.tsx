import { OrderByClause } from "@/types/query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { useColumnNames } from "@/hooks/useTableColumns";

interface Props {
  orderBy: OrderByClause;
  onUpdate: (id: string, updates: Partial<OrderByClause>) => void;
  onRemove: (id: string) => void;
}

export default function OrderByItem({ orderBy, onUpdate, onRemove }: Props) {
  const columnNames = useColumnNames();

  // 방향 토글
  const toggleDirection = (id: string, currentDirection: "ASC" | "DESC") => {
    onUpdate(id, {
      direction: currentDirection === "ASC" ? "DESC" : "ASC",
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* 컬럼 선택 */}
      <Select
        value={orderBy.column}
        onValueChange={(value) => onUpdate(orderBy.id, { column: value })}
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
        onClick={() => toggleDirection(orderBy.id, orderBy.direction)}
        className="h-10 w-24"
      >
        {orderBy.direction === "ASC" ? (
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
        onClick={() => onRemove(orderBy.id)}
        className="h-10 w-10 shrink-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
        title="정렬 삭제"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
