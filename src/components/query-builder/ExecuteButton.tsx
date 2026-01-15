"use client";

import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { useQueryStore } from "@/store/query-store";

/**
 * SQL 실행 버튼 컴포넌트
 */
export default function ExecuteButton() {
  const executeQuery = useQueryStore((state) => state.executeQuery);
  const isExecuting = useQueryStore((state) => state.isExecuting);
  const generatedSQL = useQueryStore((state) => state.generatedSQL);
  const error = useQueryStore((state) => state.error);

  const handleExecute = async () => {
    await executeQuery();
  };

  return (
    <Button
      onClick={handleExecute}
      disabled={!generatedSQL || isExecuting || !!error}
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
