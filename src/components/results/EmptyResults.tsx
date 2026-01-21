"use client";

import { SearchX } from "lucide-react";

interface Props {
  message?: string;
}

export default function EmptyResults({
  message = "결과를 찾을 수 없습니다.",
}: Props) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-420px)] bg-card rounded-lg border border-dashed border-border">
      <div className="text-center space-y-4">
        <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto">
          <SearchX className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">
            여기에 결과를 표시하려면 쿼리를 실행하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
