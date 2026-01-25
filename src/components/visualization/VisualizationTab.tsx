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
import EmptyChart from "./EmptyChart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { downloadChartAsPNG } from "@/lib/chart/chart-download";
import ChartGuide from "./ChartGuide";
import NotAxisChart from "./NotAxisChart";

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

  /** queryResult 변경시 자동으로 리렌더링
   * - chartConfig.xAxis와 chartConfig.yAxis만 확인
   */
  useEffect(() => {
    if (xAxisCandidates.length > 0 && !chartConfig.xAxis) {
      setXAxis(xAxisCandidates[0]);
    }
  }, [xAxisCandidates, chartConfig.xAxis, setXAxis]);

  useEffect(() => {
    if (yAxisCandidates.length > 0 && chartConfig.yAxis.length === 0) {
      setYAxis([yAxisCandidates[0]]);
    }
  }, [yAxisCandidates, chartConfig.yAxis, setYAxis]);

  /** 빈 결과 */
  if (!queryResult || queryResult.data.length === 0) {
    return <EmptyChart />;
  }

  /** 축 미설정 */
  if (!chartConfig.xAxis || chartConfig.yAxis.length === 0) {
    return (
      <NotAxisChart
        columnInfos={columnInfos}
        xAxisCandidates={xAxisCandidates}
        yAxisCandidates={yAxisCandidates}
      />
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
        description: "차트를 찾을 수 없습니다.\n다시 시도해주세요.",
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
        description: "차트 이미지를 다운로드 했습니다.",
      });
    } catch (error) {
      /** 에러처리개선 */
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";

      console.error("차트 다운로드 중 에러:", errorMessage);

      toast({
        title: "다운로드 실패",
        description: `차트를 다운로드하지 못했습니다.\n${errorMessage}`,
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
        <ChartGuide />
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
