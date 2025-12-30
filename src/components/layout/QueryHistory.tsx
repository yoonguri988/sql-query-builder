import { useHistoryStore } from "@/store/history-store";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";

export default function QueryHistory() {
  const { history, clearHistory, removeHistoryItem } = useHistoryStore();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <h3 className="font-semibold">Query History</h3>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="h-7 text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No queries yet
        </p>
      ) : (
        <div className="space-y-2">
          {history.map((item, idx) => (
            <div
              key={item.id}
              className="group relative bg-accent/50 rounded-lg p-3 hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  [{idx + 1}]
                </span>
                <button
                  onClick={() => removeHistoryItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove from history"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              </div>

              <pre className="text-xs font-mono mb-2 whitespace-pre-wrap break-words">
                {item.sql.length > 100
                  ? item.sql.substring(0, 100) + "..."
                  : item.sql}
              </pre>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </span>
                <span>•</span>
                <span>{item.executionTime}ms</span>
                <span>•</span>
                <span>{item.rowCount} rows</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
