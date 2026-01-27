"use client";

import { AlertCircle, Lightbulb, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSQLErrorMessage } from "@/lib/error/error-messages";

interface Props {
  error: string;
  onRetry?: () => void;
}

export default function ErrorResults({ error, onRetry }: Props) {
  const errorInfo = getSQLErrorMessage(new Error(error));

  return (
    <div className="space-y-4">
      {/* 에러 알림 */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{errorInfo.title}</AlertTitle>
        <AlertDescription>{errorInfo.description}</AlertDescription>
      </Alert>

      {/* 해결 방법 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            해결 방법
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {errorInfo.suggestion}
          </p>
        </CardContent>
      </Card>

      {/* 상세 오류 메시지 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <XCircle className="h-4 w-4" />
            상세 오류 메시지
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap break-words">
            {error}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
