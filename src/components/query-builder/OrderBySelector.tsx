import { ArrowUpDown } from "lucide-react";
import { useColumnNames } from "@/hooks/useTableColumns";
import { useQueryStore } from "@/store/query-store";
import { OrderByClause } from "@/types/query";
import { Label } from "@/components/ui/label";
import EmptyState from "./EmptyState";
import GroupButton from "./GroupButton";
import OrderByInfo from "./OrderByInfo";
import HintMessage from "./HintMessage";
import UseTipMessage from "./UseTipMessage";
import OrderByItem from "./OrderByItem";
import { memo } from "react";

/** OrderBySelector 컴포넌트
 * ORDER BY 절을 관리하는 선택기
 *
 * 기능:
 * - 정렬 컬럼 선택
 * - ASC/DESC 토글
 * - 다중 정렬 지원
 * - 정렬 순서 삭제
 *
 * @component
 */
function OrderBySelector() {
  const selectedTable = useQueryStore((state) => state.selectedTable);
  const orderBy = useQueryStore((state) => state.orderBy);
  const addOrderBy = useQueryStore((state) => state.addOrderBy);
  const updateOrderBy = useQueryStore((state) => state.updateOrderBy);
  const removeOrderBy = useQueryStore((state) => state.removeOrderBy);

  const columnNames = useColumnNames();

  // 새 정렬 추가
  const handleAddSort = () => {
    const newSort: OrderByClause = {
      id: `sort-${Date.now()}`,
      column: columnNames[0] || "",
      direction: "ASC",
    };
    addOrderBy(newSort);
  };

  const handleClearAll = () => {
    // 모든 정렬 삭제
    orderBy.forEach((condition) => {
      removeOrderBy(condition.id);
    });
  };

  /* 빈 상태 */
  if (!selectedTable) return <EmptyState />;

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <ArrowUpDown className="h-4 w-4" />
          ORDER BY
        </Label>

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-2">
          <GroupButton name="정렬 추가" onClick={handleAddSort} />
          {/* 전체 초기화 버튼 - 조건이 있을 때만 표시 */}
          {orderBy.length > 0 && (
            <GroupButton
              name="전체 삭제"
              variant="ghost"
              onClick={handleClearAll}
            />
          )}
        </div>
      </div>

      {/* 정렬 정보 */}
      <div className="text-xs text-muted-foreground">
        <OrderByInfo totalCount={orderBy.length} />
      </div>

      {/* 정렬 목록 */}
      {orderBy.length > 0 && (
        <div className="rounded-md border p-4 space-y-3">
          {orderBy.map((value, index) => (
            <>
              {/* 순서 표시 */}
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                {index + 1}
              </div>
              <OrderByItem
                key={value.id}
                orderBy={value}
                onUpdate={updateOrderBy}
                onRemove={removeOrderBy}
              />
            </>
          ))}
        </div>
      )}

      {/* 안내 메시지 */}
      {orderBy.length === 0 && (
        <HintMessage msg='"정렬 추가" 버튼을 클릭하여 결과를 정렬하세요' />
      )}

      {/* 사용 팁 */}
      {orderBy.length > 0 && (
        <UseTipMessage msg="첫 번째 정렬이 우선 적용되고, 같은 값일 경우 다음 정렬이 적용됩니다." />
      )}
    </div>
  );
}
export default memo(OrderBySelector);
