"use client";

import { useQueryStore } from "@/store/query-store";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play } from "lucide-react";

/**
 * ActionButtons 컴포넌트
 * 쿼리 빌더 액션 버튼
 *
 * 기능:
 * - Reset: 전체 초기화
 * - Execute: 쿼리 실행 (SQL.js 연동 예정)
 *
 * @component
 */
export default function ActionButtons() {
  const { selectedTable, reset, executeQuery, generatedSQL } = useQueryStore();

  // reset 핸들러
  const handleReset = () => {
    if (confirm("모든 설정을 초기화하시겠습니까?")) {
      reset();
    }
  };

  // Execute 핸들러
  const handleExecute = () => {
    if (!generatedSQL) {
      alert("SQL 쿼리가 생성되지 않았습니다.");
      return;
    }
    executeQuery();
    alert("쿼리가 실행되었습니다.\n(13일차에 SQL.js 데이터베이스 연동 예정)");
  };
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t">
      {/* Reset 버튼 */}
      <Button
        type="button"
        variant="outline"
        onClick={handleReset}
        disabled={!selectedTable}
        className="min-w-[100px]"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>

      {/* Execute 버튼 */}
      <Button
        type="button"
        onClick={handleExecute}
        disabled={!generatedSQL}
        className="min-w-[100px]"
      >
        <Play className="h-4 w-4 mr-2" />
        Execute
      </Button>
    </div>
  );
}
