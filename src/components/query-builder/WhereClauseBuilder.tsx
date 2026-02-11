"use client";

import { useQueryStore } from "@/store/query-store";
import WhereConditionItem from "./WhereConditionItem";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { WhereCondition } from "@/types/query";
import EmptyState from "./EmptyState";
import GroupButton from "./GroupButton";
import WhereClauseInfo from "./WhereClauseInfo";
import HintMessage from "./HintMessage";
import UseTipMessage from "./UseTipMessage";
import { memo } from "react";

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
function WhereClauseBuilder() {
  const selectedTable = useQueryStore((state) => state.selectedTable);
  const whereConditions = useQueryStore((state) => state.whereConditions);
  const addWhereCondition = useQueryStore((state) => state.addWhereCondition);
  const updateWhereCondition = useQueryStore(
    (state) => state.updateWhereCondition
  );
  const removeWhereCondition = useQueryStore(
    (state) => state.removeWhereCondition
  );

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

  /* 빈 상태 */
  if (!selectedTable) return <EmptyState />;

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
          <GroupButton name="조건 추가" onClick={handleAddCondition} />
          {/* 전체 초기화 버튼 - 조건이 있을 때만 표시 */}
          {whereConditions.length > 0 && (
            <GroupButton
              name="전체 삭제"
              variant="ghost"
              onClick={handleClearAll}
            />
          )}
        </div>
      </div>

      {/* 조건 정보 */}
      <div className="text-xs text-muted-foreground">
        <WhereClauseInfo whereCondCount={whereConditions.length} />
      </div>

      {/* 조건 목록 */}
      {whereConditions.length > 0 && (
        <div className="rounded-md border p-4 space-y-3 animate-in fade-in duration-200">
          {whereConditions.map((condition, index) => (
            <div
              key={index}
              // className="animate-slide-in"
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <WhereConditionItem
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
        <HintMessage msg='"조건 추가" 버튼을 클릭하여 필터링 조건을 추가하세요' />
      )}

      {/* 사용 팁 */}
      {whereConditions.length > 0 && whereConditions.length <= 3 && (
        <UseTipMessage
          msg="여러 조건을 AND로 연결하면 모든 조건을 만족하는 행만 조회되고,
          OR로 연결하면 하나라도 만족하는 행이 조회됩니다."
        />
      )}
    </div>
  );
}
export default memo(WhereClauseBuilder);
