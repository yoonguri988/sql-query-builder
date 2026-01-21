"use client";

import { ExecutionMetadata } from "@/types/query";
import { Clock, Database, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ExecutionInfoProps {
  metadata: ExecutionMetadata;
}

/**
 * SQL 실행 정보 표시 컴포넌트
 */
export default function ExecutionInfo({ metadata }: ExecutionInfoProps) {
  const { executionTime, rowCount, status, error, timestamp } = metadata;

  const statusConfig = {
    success: {
      icon: CheckCircle2,
      label: "Success",
      variant: "default" as const,
    },
    error: {
      icon: XCircle,
      label: "Error",
      variant: "destructive" as const,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge variant={config.variant} className="gap-1.5">
            <StatusIcon className="h-3.5 w-3.5" />
            {config.label}
          </Badge>
        </div>

        {/* Execution Metrics */}
        <div className="flex items-center gap-6 text-sm">
          {/* Execution Time */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{executionTime}ms</span>
          </div>

          {/* Row Count */}
          {status === "success" && (
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {rowCount} {rowCount === 1 ? "row" : "rows"}
              </span>
            </div>
          )}

          {/* Timestamp */}
          {timestamp && (
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
            오류 상세 정보
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </Card>
  );
}
