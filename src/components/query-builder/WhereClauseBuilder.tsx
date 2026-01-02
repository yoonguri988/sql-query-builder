"use client";

import { useQueryStore } from "@/store/query-store";
import { useColumnNames } from "@/hooks/useTableColumns";
import { ConditionRow } from "./ConditionRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Filter, Plus } from "lucide-react";
import { WhereCondition } from "@/types/query";

/**
 * WhereClauseBuilder 컴포넌트
 * WHERE 절 조건을 관리하는 빌더
 *
 * 기능:
 * - WHERE 조건 목록 표시
 * - 새 조건 추가 버튼
 * - 각 조건 수정/삭제
 * - 빈 상태 안내
 *
 * @component
 * @example
 * <WhereClauseBuilder />
 */
export default function WhereClauseBuilder() {
  const {
    selectedTable,
    whereConditions,
    addWhereCondition,
    updateWhereCondition,
    removeWhereCondition,
  } = useQueryStore();

  const columnNames = useColumnNames();

  // 테이블이 선택되지 않았을 때
  if (!selectedTable) {
    return (
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          WHERE
        </Label>
        <div className="text-sm text-muted-foreground">
          먼저 테이블을 선택하세요
        </div>
      </div>
    );
  }

  // 새 조건 추가 핸들러
  const handleAddCondition = () => {
    const newCondition: WhereCondition = {
      id: `condition-${Date.now()}`,
      column: columnNames[0] || "", // 첫 번째 컬럼 기본 선택
      operator: "=",
      value: "",
      logicalOperator: whereConditions.length > 0 ? "AND" : undefined,
    };
    addWhereCondition(newCondition);
  };

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Filter className="h-4 w-4" />
          WHERE
        </Label>

        {/* 조건 추가 버튼 */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCondition}
          className="h-8 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          조건 추가
        </Button>
      </div>

      {/* 조건 개수 표시 */}
      <div className="text-xs text-muted-foreground">
        {whereConditions.length === 0 ? (
          <span>조건 없음 (모든 행 조회)</span>
        ) : (
          <span>
            조건{" "}
            <span className="font-semibold text-foreground">
              {whereConditions.length}
            </span>
            개
          </span>
        )}
      </div>

      {/* 조건 목록 */}
      {whereConditions.length > 0 && (
        <div className="rounded-md border p-4 space-y-3">
          {whereConditions.map((condition, index) => (
            <ConditionRow
              key={condition.id}
              condition={condition}
              onUpdate={updateWhereCondition}
              onRemove={removeWhereCondition}
              showLogicalOperator={index > 0}
            />
          ))}
        </div>
      )}

      {/* 안내 메시지 */}
      {whereConditions.length === 0 && (
        <div className="rounded-md border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            WHERE 조건이 없습니다
          </p>
          <p className="text-xs text-muted-foreground">
            💡 {"조건 추가"} 버튼을 클릭하여 필터링 조건을 추가하세요
          </p>
        </div>
      )}
    </div>
  );
}
