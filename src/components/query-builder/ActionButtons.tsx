"use client";

import { useQueryStore } from "@/store/query-store";
import ExecuteButton from "@/components/query-builder/ExecuteButton";
import ResetButtons from "@/components/query-builder/ResetButtons";

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
export default function ActionButtons() {
  const reset = useQueryStore((state) => state.reset);

  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t">
      {/* Execute 버튼 */}
      <ExecuteButton />
      {/* Reset 버튼 */}
      <ResetButtons />
    </div>
  );
}
