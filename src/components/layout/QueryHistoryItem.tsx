import { QueryHistoryItem as HistoryType } from "@/types/query";
import { Clock, RotateCcw, Trash2 } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Badge } from "../ui/badge";
import { memo } from "react";

interface Props {
  item: HistoryType;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

function QueryHistoryItem({ item, onClick, onDelete }: Props) {
  const { theme } = useTheme();
  const syntaxStyle = theme === "dark" ? vscDarkPlus : vs;
  return (
    <div className="border rounded-lg p-3 space-y-2 hover:bg-accent/50 transition-colors">
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
          variant={item.status === "success" ? "default" : "destructive"}
          className="text-xs"
        >
          {item.status === "success" ? `${item.rowCount} rows` : "Error"}
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
          onClick={() => onClick(item.id)}
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          복원
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default memo(QueryHistoryItem);
