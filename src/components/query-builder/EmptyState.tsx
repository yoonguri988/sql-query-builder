import { Columns3 } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function EmptyState() {
  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        먼저 테이블을 선택하세요
      </div>
    </div>
  );
}
