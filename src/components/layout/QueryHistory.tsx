"use client";

import { useHistoryStore } from "@/store/history-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { History, Trash2, RotateCcw, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useQueryStore } from "@/store/query-store";
import { useToast } from "@/hooks/use-toast";
import { useUIStore } from "@/store/ui-store";
import { useTheme } from "next-themes";

export default function QueryHistory() {
  const { history, clearHistory, removeHistoryItem } = useHistoryStore();
  const { restoreFromHistory } = useQueryStore();
  const { setActiveRightPanelTab } = useUIStore();
  const { toast } = useToast();
  const { theme } = useTheme();
  // 다크모드에 따라 스타일 선택
  const syntaxStyle = theme === "dark" ? vscDarkPlus : vs;

  const handleRestore = (id: string) => {
    const item = useHistoryStore.getState().getHistoryById(id);
    if (item) {
      restoreFromHistory(item);

      // SQL Preview 탭으로 이동
      setActiveRightPanelTab("sql");

      toast({
        title: "쿼리 복원 완료",
        description: "이전 쿼리가 복원되었습니다.",
        duration: 2000,
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <h2 className="font-semibold">Query History</h2>
          <Badge variant="secondary">{history.length}</Badge>
        </div>

        {history.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>모든 히스토리 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  모든 쿼리 히스토리를 삭제하시겠습니까? 이 작업은 되돌릴 수
                  없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory}>
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <ScrollArea className="flex-1">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <History className="h-12 w-12 mb-2" />
            <p className="text-sm text-center">아직 실행된 쿼리가 없습니다</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 space-y-2 hover:bg-accent/50 transition-colors"
              >
                <div className="font-mono text-xs bg-muted p-2 rounded overflow-x-auto">
                  <SyntaxHighlighter
                    language="sql"
                    style={syntaxStyle}
                    customStyle={{
                      margin: 0,
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      padding: "1rem",
                      maxHeight: "500px",
                      maxWidth: "230px",
                      overflow: "auto",
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                  >
                    {item.sql}
                  </SyntaxHighlighter>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(item.timestamp, {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                  </div>
                  <Badge
                    variant={
                      item.status === "success" ? "default" : "destructive"
                    }
                    className="text-xs"
                  >
                    {item.status === "success"
                      ? `${item.rowCount} rows`
                      : "Error"}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  {item.executionTime}ms
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleRestore(item.id)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    복원
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHistoryItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
