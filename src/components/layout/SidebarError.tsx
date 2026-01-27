import {
  AlertCircle,
  RefreshCw,
  Lightbulb,
  Globe,
  LockKeyhole,
  AlarmClock,
  Save,
  Database,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getErrorSuggestion } from "@/lib/error/sidebar-error-messages";

interface SidebarErrorProps {
  error: string;
  onRetry?: () => void;
}

const ICONS: Record<string, React.ReactNode> = {
  globe: <Globe />,
  lockKeyhole: <LockKeyhole />,
  alarmClock: <AlarmClock />,
  save: <Save />,
  database: <Database />,
  triangleAlert: <TriangleAlert />,
};

export default function SidebarError({ error, onRetry }: SidebarErrorProps) {
  const errorInfo = getErrorSuggestion(error);

  return (
    <aside className="w-full md:w-64 lg:w-[200px] xl:w-[300px] border-r border-border bg-background">
      <div className="flex items-center justify-center h-full p-4">
        <div className="w-full space-y-3">
          {/* 에러 카드 */}
          <Card className="border-destructive/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-destructive" />
                {errorInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground break-words">
                {error}
              </p>
            </CardContent>
          </Card>

          {/* 해결 방법 */}
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <span className="mr-1">{ICONS[errorInfo.icon]}</span>
              {errorInfo.suggestion}
            </AlertDescription>
          </Alert>

          {/* 재시도 버튼 */}
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="w-full"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              다시 시도
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
