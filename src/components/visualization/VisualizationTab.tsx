"use client";

import { useQueryStore } from "@/store/query-store";
import { useChartStore } from "@/store/chart-store";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  analyzeQueryResult,
  recommendChartAxes,
  transformToChartData,
} from "@/lib/chart/data-analyzer";
import ChartSettings from "./ChartSettings";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { downloadChartAsPNG } from "@/lib/chart/chart-download";

export default function VisualizationTab() {
  const queryResult = useQueryStore((state) => state.queryResult);
  const { chartConfig, setXAxis, setYAxis } = useChartStore();
  /** 차트 영역을 참조 */
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  /** 성능 최적화: 쿼리 결과가 변경될 때만 재계산 */
  const columnInfos = useMemo(() => {
    if (!queryResult || queryResult.data.length === 0) {
      return [];
    }
    return analyzeQueryResult(queryResult.data); // 컬럼 타입 분석
  }, [queryResult]);

  const { xAxisCandidates, yAxisCandidates } = useMemo(() => {
    return recommendChartAxes(columnInfos); // X/Y축 후보 추천
  }, [columnInfos]);

  const chartData = useMemo(() => {
    if (!queryResult || queryResult.data.length === 0) {
      return [];
    }
    return transformToChartData(queryResult.data); // 차트 데이터 변환
  }, [queryResult]);

  /** queryResult 변경시 자동으로 리렌더링 */
  useEffect(() => {
    if (xAxisCandidates.length > 0 && !chartConfig.xAxis) {
      setXAxis(xAxisCandidates[0]);
    }
    if (yAxisCandidates.length > 0 && chartConfig.yAxis.length === 0) {
      setYAxis([yAxisCandidates[0]]);
    }
  }, [xAxisCandidates, yAxisCandidates, chartConfig, setXAxis, setYAxis]);

  /** 빈 결과 */
  if (!queryResult || queryResult.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert>
          <BarChart3 className="h-4 w-4" />
          <AlertDescription>
            쿼리를 실행하면 결과를 차트로 시각화할 수 있습니다.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  /** 축 미설정 */
  if (!chartConfig.xAxis || chartConfig.yAxis.length === 0) {
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

  const renderChart = () => {
    switch (chartConfig.type) {
      case "bar":
        return <BarChart data={chartData} config={chartConfig} />;
      case "line":
        return <LineChart data={chartData} config={chartConfig} />;
      case "pie":
        return <PieChart data={chartData} config={chartConfig} />;
      default:
        return null;
    }
  };

  const handleDownloadPNG = async () => {
    if (!chartRef.current) {
      toast({
        title: "Error",
        description: "Chart not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      await downloadChartAsPNG(chartRef.current, {
        chartType: chartConfig.type,
        backgroundColor: "white",
      });

      toast({
        title: "Success",
        description: "Chart downloaded successfully!",
      });
    } catch (error) {
      console.error("Error downloading chart:", error);
      toast({
        title: "Error",
        description: "Failed to download chart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Data Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <ChartSettings
            columnInfos={columnInfos}
            xAxisCandidates={xAxisCandidates}
            yAxisCandidates={yAxisCandidates}
          />
        </div>

        <div ref={chartRef} className="border-2 rounded-lg p-6 bg-muted/10">
          <div className="flex items-center justify-center mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              📊 Chart Rendering Area
            </span>
          </div>
          {renderChart()}
        </div>

        <div className="flex justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPNG}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download PNG"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
