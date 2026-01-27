import { Loader2 } from "lucide-react";
import TableSkeleton from "./TableSkeleton";

export default function LoadingResults() {
  return (
    <div className="space-y-4">
      {/* 로딩 메시지 */}
      <div className="flex items-center justify-center p-4 gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">쿼리 실행 중...</p>
      </div>

      {/* 테이블 스켈레톤 */}
      <TableSkeleton />
    </div>
  );
}
