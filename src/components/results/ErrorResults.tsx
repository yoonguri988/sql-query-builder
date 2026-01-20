"use client";

interface Props {
  error: string;
}

export default function ErrorResults({ error }: Props) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-420px)] bg-card rounded-lg border border-destructive/20">
      <div className="text-center space-y-4 max-w-md px-6">
        <div className="rounded-full bg-destructive/10 w-16 h-16 flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">쿼리 오류</p>
          <p className="text-sm text-muted-foreground break-words">{error}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          SQL 문법을 확인 후에 다시 쿼리를 실행해주세요
        </p>
      </div>
    </div>
  );
}
