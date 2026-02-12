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
import { History, Trash2 } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { useToast } from "@/hooks/use-toast";
import { memo } from "react";
import QueryHistoryItem from "./QueryHistoryItem";

function QueryHistory() {
  const history = useHistoryStore((state) => state.history);
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const removeHistoryItem = useHistoryStore((state) => state.removeHistoryItem);

  const restoreFromHistory = useQueryStore((state) => state.restoreFromHistory);
  const { toast } = useToast();

  const handleRestore = (id: string) => {
    const item = useHistoryStore.getState().getHistoryById(id);
    if (item) {
      restoreFromHistory(item);

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

      <ScrollArea className="flex-1 touch-pan-y">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <History className="h-12 w-12 mb-2" />
            <p className="text-sm text-center">아직 실행된 쿼리가 없습니다</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {history.map((item) => (
              <QueryHistoryItem
                key={item.id}
                item={item}
                onClick={handleRestore}
                onDelete={removeHistoryItem}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default memo(QueryHistory);
