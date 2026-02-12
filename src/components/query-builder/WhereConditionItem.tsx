"use client";

import { WhereCondition, WhereOperator } from "@/types/query";
import { useColumnNames } from "@/hooks/useTableColumns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { memo, useMemo } from "react";

const OPERATORS: { value: WhereOperator; label: string }[] = [
  { value: "=", label: "=" },
  { value: "!=", label: "!=" },
  { value: ">", label: ">" },
  { value: ">=", label: ">=" },
  { value: "<", label: "<" },
  { value: "<=", label: "<=" },
  { value: "LIKE", label: "LIKE" },
  { value: "IN", label: "IN" },
  { value: "IS NULL", label: "IS NULL" },
  { value: "IS NOT NULL", label: "IS NOT NULL" },
];

interface Props {
  condition: WhereCondition;
  onUpdate: (id: string, updates: Partial<WhereCondition>) => void;
  onRemove: (id: string) => void;
  showLogicalOperator?: boolean;
}

function WhereConditionItem({
  condition,
  onUpdate,
  onRemove,
  showLogicalOperator = false,
}: Props) {
  const columnNames = useColumnNames();

  const isNullOperator =
    condition.operator === "IS NULL" || condition.operator === "IS NOT NULL";

  const validation = useMemo(() => {
    const errors: string[] = [];

    if (!condition.column) {
      errors.push("컬럼을 선택하세요");
    }

    if (!isNullOperator && !condition.value.toString().trim()) {
      errors.push("값을 입력하세요");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [condition.column, condition.value, isNullOperator]);

  const hasError = !validation.isValid;

  return (
    <div className="space-y-2">
      <div className="flex sm:flex-row items-stretch sm:items-start gap-2">
        {showLogicalOperator && (
          <Select
            value={condition.logicalOperator || "AND"}
            onValueChange={(value) =>
              onUpdate(condition.id, { logicalOperator: value as "AND" | "OR" })
            }
          >
            <SelectTrigger className="w-full sm:w-[100px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2 flex-1">
          <Select
            value={condition.column}
            onValueChange={(value) => onUpdate(condition.id, { column: value })}
          >
            <SelectTrigger
              className={`w-full sm:w-[180px] h-9 text-sm ${!condition.column && hasError ? "border-red-500" : ""}`}
            >
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

          <Select
            value={condition.operator}
            onValueChange={(value) =>
              onUpdate(condition.id, { operator: value as WhereOperator })
            }
          >
            <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-9 text-sm">
              <SelectValue placeholder="연산자" />
            </SelectTrigger>
            <SelectContent>
              {OPERATORS.map((op) => (
                <SelectItem key={op.value} value={op.value}>
                  <span className="text-xs sm:text-sm">{op.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!isNullOperator && (
            <Input
              type="text"
              placeholder="값 입력"
              value={condition.value}
              onChange={(e) =>
                onUpdate(condition.id, { value: e.target.value })
              }
              className={`w-full sm:flex-1 h-9 text-sm ${!condition.value.toString().trim() && hasError ? "border-red-500" : ""}`}
            />
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(condition.id)}
          className="h-9 w-9 shrink-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 self-start"
          title="조건 삭제"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {hasError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 pl-0 sm:pl-[112px]">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{validation.errors.join(", ")}</span>
        </div>
      )}
    </div>
  );
}

export default memo(WhereConditionItem);
