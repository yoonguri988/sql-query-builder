"use client";

import ExecuteButton from "@/components/query-builder/ExecuteButton";
import ResetButtons from "@/components/query-builder/ResetButtons";
import { memo } from "react";

/**
 * ActionButtons 컴포넌트
 * 쿼리 빌더 액션 버튼
 *
 * 기능:
 * - Reset: 전체 초기화
 * - Execute: 쿼리 실행 (SQL.js)
 *
 * @component
 */
function ActionButtons() {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t">
      {/* Reset 버튼 */}
      <ResetButtons />
      {/* Execute 버튼 */}
      <ExecuteButton />
    </div>
  );
}
export default memo(ActionButtons);
