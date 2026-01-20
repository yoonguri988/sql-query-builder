"use client";

export default function EmptyResults() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-420px)] bg-card rounded-lg border border-dashed border-border">
      <div className="text-center space-y-4">
        <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">
            결과를 찾을 수 없습니다.
          </p>
          <p className="text-sm text-muted-foreground">
            여기에 결과를 표시하려면 쿼리를 실행하세요.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {/* <p>쿼리빌더를 선택 한 후에 테이블을 선택해</p> */}
          {/* <p>&quot;쿼리 실행&quot; 을 클릭하여 결과를 확인하세요</p> */}
          {/* <p>• </p> */}
        </div>
      </div>
    </div>
  );
}
