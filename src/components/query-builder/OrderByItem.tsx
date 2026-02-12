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
import { memo } from "react";

interface Props {
  orderBy: OrderByClause;
  onUpdate: (id: string, updates: Partial<OrderByClause>) => void;
  onRemove: (id: string) => void;
}

function OrderByItem({ orderBy, onUpdate, onRemove }: Props) {
  const columnNames = useColumnNames();

  const toggleDirection = (id: string, currentDirection: "ASC" | "DESC") => {
    onUpdate(id, {
      direction: currentDirection === "ASC" ? "DESC" : "ASC",
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
        <Select
          value={orderBy.column}
          onValueChange={(value) => onUpdate(orderBy.id, { column: value })}
        >
          <SelectTrigger className="w-full sm:flex-1 h-9 text-sm">
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

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toggleDirection(orderBy.id, orderBy.direction)}
            className="h-9 w-full sm:w-24 text-xs sm:text-sm"
          >
            {orderBy.direction === "ASC" ? (
              <>
                <ArrowUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                <span>ASC</span>
              </>
            ) : (
              <>
                <ArrowDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                <span>DESC</span>
              </>
            )}
          </Button>
        </div>
      </div>
      <div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(orderBy.id)}
          className="h-9 w-9 shrink-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
          title="정렬 삭제"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}

export default memo(OrderByItem);
