"use client";

import { useQueryStore } from "@/store/query-store";
import { ConditionRow } from "./ConditionRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Filter, Plus, Trash2 } from "lucide-react";
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
 * [260102]
 * - 전체 초기화
 * - 조건 개수에 따른 UI 피드백
 * - 애니메이션 효과 (추가/삭제)
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
      column: "", // 사용자가 직접 선택
      operator: "=",
      value: "",
      logicalOperator: whereConditions.length > 0 ? "AND" : undefined,
    };
    addWhereCondition(newCondition);
  };

  /** 260102 전체 초기화 핸들러 */
  const handleClearAll = () => {
    // 모든 조건 삭제
    whereConditions.forEach((condition) => {
      removeWhereCondition(condition.id);
    });
  };

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Filter className="h-4 w-4" />
          WHERE
        </Label>

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-2">
          {/* 전체 초기화 버튼 - 조건이 있을 때만 표시 */}
          {whereConditions.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              전체 삭제
            </Button>
          )}
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
            {whereConditions.length > 3 && (
              <span className="text-orange-600 dark:text-orange-400 ml-2">
                • 많은 조건은 쿼리 속도를 저하시킬 수 있습니다
              </span>
            )}
          </span>
        )}
      </div>

      {/* 조건 목록 */}
      {whereConditions.length > 0 && (
        <div className="rounded-md border p-4 space-y-3 animate-in fade-in duration-200">
          {whereConditions.map((condition, index) => (
            <div
              key={condition.id}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ConditionRow
                key={condition.id}
                condition={condition}
                onUpdate={updateWhereCondition}
                onRemove={removeWhereCondition}
                showLogicalOperator={index > 0}
              />
            </div>
          ))}
        </div>
      )}

      {/* 안내 메시지 */}
      {whereConditions.length === 0 && (
        <div className="rounded-md border border-dashed p-6 text-center">
          <Filter className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground mb-2">
            WHERE 조건이 없습니다
          </p>
          <p className="text-xs text-muted-foreground">
            💡 {"조건 추가"} 버튼을 클릭하여 필터링 조건을 추가하세요
          </p>
        </div>
      )}

      {/* 사용 팁 */}
      {whereConditions.length > 0 && whereConditions.length <= 3 && (
        <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 rounded p-2">
          💡 팁: 여러 조건을 AND로 연결하면 모든 조건을 만족하는 행만 조회되고,
          OR로 연결하면 하나라도 만족하는 행이 조회됩니다.
        </div>
      )}
    </div>
  );
}
