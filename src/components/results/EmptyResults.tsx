import { FileQuestion } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyResultsProps {
  message?: string;
  showIcon?: boolean;
}

export default function EmptyResults({
  message = "쿼리를 실행하여 결과를 확인하세요.",
  showIcon = true,
}: EmptyResultsProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        {showIcon && (
          <div className="mb-4 rounded-full bg-muted p-4">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">결과 없음</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      </CardContent>
    </Card>
  );
}
