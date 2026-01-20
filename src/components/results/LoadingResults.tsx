"use client";

export default function LoadingResults() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-420px)] bg-card rounded-lg border border-border">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted mx-auto"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
        </div>
        <div className="space-y-1">
          <p className="text-base font-medium text-foreground">
            쿼리가 실행되고 있습니다.
          </p>
          <p className="text-sm text-muted-foreground">
            잠시만 기다려 주세요...
          </p>
        </div>
      </div>
    </div>
  );
}
