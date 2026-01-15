"use client";

import { useQueryStore } from "@/store/query-store";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import ExecuteButton from "@/components/query-builder/ExecuteButton";

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
      <Button
        type="button"
        variant="outline"
        onClick={reset}
        className="min-w-[100px]"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        초기화
      </Button>
    </div>
  );
}
