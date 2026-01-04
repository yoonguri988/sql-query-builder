"use client";

import { useQueryStore } from "@/store/query-store";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play } from "lucide-react";
import { useState } from "react";
import { initDatabase } from "@/lib/db/init-db";

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
  const { selectedTable, reset, executeQuery, generatedSQL } = useQueryStore();
  // 쿼리 실행
  const [isExecuting, setIsExecuting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // reset 핸들러
  const handleReset = () => {
    if (confirm("모든 설정을 초기화하시겠습니까?")) {
      reset();
    }
  };

  // Execute 핸들러
  const handleExecute = async () => {
    if (!generatedSQL) {
      alert("SQL 쿼리가 생성되지 않았습니다.");
      return;
    }

    setIsExecuting(true);

    try {
      // 데이터베이스 초기화 (최초 1회)
      if (!isInitialized) {
        await initDatabase();
        setIsInitialized(true);
      }

      await executeQuery();
    } catch (error) {
      console.error("[ActionButtons] Execute error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "쿼리 실행 중 오류가 발생했습니다."
      );
    } finally {
      setIsExecuting(false);
    }
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
        disabled={!generatedSQL || isExecuting}
        className="min-w-[100px]"
      >
        <Play className="h-4 w-4 mr-2" />
        {isExecuting ? "Executing..." : "Execute"}
      </Button>
    </div>
  );
}
