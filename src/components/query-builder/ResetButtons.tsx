"use client";

import { Button } from "@/components/ui/button";
import { useQueryStore } from "@/store/query-store";
import { RotateCcw, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { memo } from "react";

function ResetButtons() {
  const resetAll = useQueryStore((state) => state.resetAll);
  const resetExecution = useQueryStore((state) => state.resetExecution);
  const resetWhereConditions = useQueryStore(
    (state) => state.resetWhereConditions
  );
  const hasResult = useQueryStore((state) => state.queryResult !== null);
  const hasWhereConditions = useQueryStore(
    (state) => state.whereConditions.length > 0
  );

  return (
    <div className="flex items-center gap-2">
      {/* WHERE 조건 초기화 */}
      {hasWhereConditions && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetWhereConditions}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          WHERE 초기화
        </Button>
      )}

      {/* 실행 결과 초기화 */}
      {hasResult && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetExecution}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          결과 지우기
        </Button>
      )}

      {/* 전체 초기화 (확인 다이얼로그) */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            전체 초기화
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>쿼리 빌더 초기화</AlertDialogTitle>
            <AlertDialogDescription>
              모든 설정과 결과가 초기화됩니다.
            </AlertDialogDescription>
            <AlertDialogDescription>계속하시겠습니까?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={resetAll}>초기화</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default memo(ResetButtons);
