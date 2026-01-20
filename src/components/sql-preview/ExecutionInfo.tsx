"use client";

import { ExecutionMetadata } from "@/types/query";
import {
  Clock,
  Database,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface ExecutionInfoProps {
  metadata: ExecutionMetadata;
}

/**
 * SQL 실행 정보 표시 컴포넌트
 */
export default function ExecutionInfo({ metadata }: ExecutionInfoProps) {
  const { executionTime, rowCount, status, error } = metadata;

  const statusConfig = {
    success: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      label: "Success",
      variant: "default" as const,
    },
    error: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      label: "Error",
      variant: "destructive" as const,
    },
    idle: {
      icon: AlertCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      label: "Idle",
      variant: "secondary" as const,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className="p-4 mb-4">
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
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {rowCount} {rowCount === 1 ? "row" : "rows"}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800 font-medium mb-1">
            Error Details:
          </p>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </Card>
  );
}
