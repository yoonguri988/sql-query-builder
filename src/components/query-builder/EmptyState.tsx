import { memo } from "react";

function EmptyState() {
  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        먼저 테이블을 선택하세요
      </div>
    </div>
  );
}
export default memo(EmptyState);
