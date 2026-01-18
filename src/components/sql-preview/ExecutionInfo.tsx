"use client";

import { useQueryStore } from "@/store/query-store";
import {
  Clock,
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  Columns,
} from "lucide-react";

/**
 * SQL 실행 정보 표시 컴포넌트
 */
export default function ExecutionInfo() {
  const queryResult = useQueryStore((state) => state.queryResult);
  const executionTime = useQueryStore((state) => state.executionTime);
  const error = useQueryStore((state) => state.error);
  const isExecuting = useQueryStore((state) => state.isExecuting);

  // 실행 중 상태
  if (isExecuting) {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-100">
              실행 중...
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              SQL 쿼리를 실행하고 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">
              실행 오류
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1 whitespace-pre-wrap">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 결과가 있는 경우 (성공 상태)
  if (queryResult) {
    return (
      <div className="space-y-4">
        {/* 성공 헤더 */}
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">실행 완료</span>
        </div>

        {/* 실행 정보 */}
        <div className="bg-muted/30 border rounded-lg p-4 space-y-3 text-sm">
          {/* 행 수 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Database className="h-4 w-4" />
              <span>Rows:</span>
            </div>
            <span className="font-semibold text-primary">
              {queryResult.rowCount.toLocaleString()}
            </span>
          </div>

          {/* 실행 시간 - executionTime을 별도 상태로 관리 */}
          {executionTime !== null && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Execution Time:</span>
              </div>
              <span
                className={`font-medium ${
                  executionTime < 100
                    ? "text-green-600 dark:text-green-400"
                    : executionTime < 500
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                }`}
              >
                {executionTime < 1000
                  ? `${executionTime.toFixed(2)}ms`
                  : `${(executionTime / 1000).toFixed(2)}s`}
              </span>
            </div>
          )}

          {/* 컬럼 목록 */}
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Columns className="h-4 w-4" />
              <span>Columns ({queryResult.columns.length}):</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {queryResult.columns.map((col) => (
                <span
                  key={col}
                  className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* 결과 없음 메시지 */}
          {queryResult.rowCount === 0 && (
            <div className="pt-3 border-t">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                ⚠️ 조건에 맞는 데이터가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 초기 상태 (아무것도 실행 안 함)
  return (
    <div className="bg-muted/30 border rounded-lg p-4 space-y-3 text-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Database className="h-4 w-4" />
          <span>Rows:</span>
        </div>
        <span className="font-medium text-muted-foreground">-</span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Execution Time:</span>
        </div>
        <span className="font-medium text-muted-foreground">-</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Status:</span>
        <span className="font-medium text-muted-foreground">Ready</span>
      </div>

      <div className="pt-3 border-t">
        <p className="text-xs text-muted-foreground italic">
          SQL을 실행하면 정보가 표시됩니다
        </p>
      </div>
    </div>
  );
}
