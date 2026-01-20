"use client";

import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { useToast } from "@/hooks/use-toast";
import { useHistoryStore } from "@/store/history-store";

/**
 * SQL 실행 버튼 컴포넌트
 */
export default function ExecuteButton() {
  const { toast } = useToast();

  // Query Store
  const executeQuery = useQueryStore((state) => state.executeQuery);
  const isExecuting = useQueryStore((state) => state.isExecuting);
  const generatedSQL = useQueryStore((state) => state.generatedSQL);
  const error = useQueryStore((state) => state.error);

  // History Store
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleExecute = async () => {
    if (!generatedSQL) {
      toast({
        variant: "destructive",
        title: "쿼리 없음",
        description: "실행할 SQL 쿼리가 없습니다.",
      });
      return;
    }

    try {
      // 쿼리 실행
      const result = await executeQuery();

      // 실행 결과가 없는 경우 (예외 상황)
      if (!result) {
        toast({
          variant: "destructive",
          title: "실행 실패",
          description: "쿼리 실행 중 오류가 발생했습니다.",
        });
        return;
      }

      const { metadata } = result;

      // 히스토리 저장
      addHistory({
        sql: generatedSQL,
        executionTime: metadata.executionTime,
        rowCount: metadata.rowCount,
        status: metadata.status,
        error: metadata.error,
      });

      // 성공/에러 상태에 따른 Toast 알림
      if (metadata.status === "success") {
        toast({
          title: "쿼리 실행 성공",
          description: `${metadata.rowCount}개의 행이 반환되었습니다. (${metadata.executionTime}ms)`,
        });

        // ⭐ Results 탭으로 자동 전환 (옵션)
        // 이 부분은 RightPanel에서 관리할 수도 있습니다
        // 여기서는 이벤트를 발생시키거나 전역 상태로 관리할 수 있습니다
      } else if (metadata.status === "error") {
        toast({
          variant: "destructive",
          title: "쿼리 실행 실패",
          description: metadata.error || "알 수 없는 오류가 발생했습니다.",
        });
      }
    } catch (err) {
      // 예상치 못한 에러 처리
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류";

      toast({
        variant: "destructive",
        title: "실행 중 오류 발생",
        description: errorMessage,
      });
    }
  };

  // 버튼 비활성화 조건
  const isDisabled = !generatedSQL || isExecuting || !!error;

  return (
    <Button
      onClick={handleExecute}
      disabled={isDisabled}
      size="lg"
      className="w-full"
      variant="default"
    >
      {isExecuting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          실행 중...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          쿼리 실행
        </>
      )}
    </Button>
  );
}
