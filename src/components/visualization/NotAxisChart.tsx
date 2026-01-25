import { BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import ChartSettings from "./ChartSettings";
import { ColumnInfo } from "@/lib/chart/data-analyzer";

interface Props {
  columnInfos: ColumnInfo[];
  xAxisCandidates: string[];
  yAxisCandidates: string[];
}

export default function NotAxisChart({
  columnInfos,
  xAxisCandidates,
  yAxisCandidates,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <ChartSettings
          columnInfos={columnInfos}
          xAxisCandidates={xAxisCandidates}
          yAxisCandidates={yAxisCandidates}
        />
      </div>
      <div className="lg:col-span-2 flex items-center justify-center">
        <Alert>
          <BarChart3 className="h-4 w-4" />
          <AlertDescription>
            X축과 Y축을 선택하여 차트를 생성하세요.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
