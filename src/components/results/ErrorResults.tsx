"use client";

import { TriangleAlert } from "lucide-react";

interface Props {
  error: string;
  onRetry?: () => void;
}

export default function ErrorResults({ error, onRetry }: Props) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-420px)] bg-card rounded-lg border border-destructive/20">
      <div className="text-center space-y-4 max-w-md px-6">
        <div className="rounded-full bg-destructive/10 w-16 h-16 flex items-center justify-center mx-auto">
          <TriangleAlert className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">쿼리 오류</p>
          <p className="text-sm text-muted-foreground break-words">{error}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          SQL 문법을 확인 후에 다시 쿼리를 실행해주세요
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
