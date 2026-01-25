import { BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-64">
      <Alert>
        <BarChart3 className="h-4 w-4" />
        <AlertDescription>
          쿼리를 실행하면 결과를 차트로 시각화할 수 있습니다.
        </AlertDescription>
      </Alert>
    </div>
  );
}
