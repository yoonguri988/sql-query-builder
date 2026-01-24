"use client";

import { useEffect, useMemo } from "react";
import { useChartStore } from "@/store/chart-store";
import ChartSettings from "@/components/visualization/ChartSettings";
import BarChart from "@/components/visualization/BarChart";
import LineChart from "@/components/visualization/LineChart";
import PieChart from "@/components/visualization/PieChart";
import {
  analyzeQueryResult,
  recommendChartAxes,
  transformToChartData,
} from "@/lib/chart/data-analyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const monthlyData = [
  { month: "Jan", sales: 4000, cost: 2400, profit: 1600 },
  { month: "Feb", sales: 3000, cost: 1398, profit: 1602 },
  { month: "Mar", sales: 2000, cost: 9800, profit: -7800 },
  { month: "Apr", sales: 2780, cost: 3908, profit: -1128 },
  { month: "May", sales: 1890, cost: 4800, profit: -2910 },
  { month: "Jun", sales: 2390, cost: 3800, profit: -1410 },
];

export default function TestChartSettingsPage() {
  const { chartConfig, setXAxis, setYAxis, resetChartConfig } = useChartStore();

  const columnInfos = useMemo(() => {
    return analyzeQueryResult(monthlyData);
  }, []);

  const { xAxisCandidates, yAxisCandidates } = useMemo(() => {
    return recommendChartAxes(columnInfos);
  }, [columnInfos]);

  const chartData = useMemo(() => {
    return transformToChartData(monthlyData);
  }, []);

  useEffect(() => {
    if (xAxisCandidates.length > 0 && !chartConfig.xAxis) {
      setXAxis(xAxisCandidates[0]);
    }
    if (yAxisCandidates.length > 0 && chartConfig.yAxis.length === 0) {
      setYAxis([yAxisCandidates[0]]);
    }
  }, [xAxisCandidates, yAxisCandidates, chartConfig, setXAxis, setYAxis]);

  const renderChart = () => {
    if (!chartConfig.xAxis || chartConfig.yAxis.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          X축과 Y축을 선택해주세요
        </div>
      );
    }

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

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Chart Settings Test</h1>
        <p className="text-muted-foreground">
          32일차 사용 시나리오 테스트: 차트 타입 선택 및 X/Y축 설정
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Chart Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartSettings
              columnInfos={columnInfos}
              xAxisCandidates={xAxisCandidates}
              yAxisCandidates={yAxisCandidates}
            />
            <Separator className="my-4" />
            <button
              onClick={resetChartConfig}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
            >
              Reset Settings
            </button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chart Preview</CardTitle>
          </CardHeader>
          <CardContent>{renderChart()}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="font-semibold">Chart Type:</span>{" "}
              {chartConfig.type}
            </div>
            <div>
              <span className="font-semibold">X Axis:</span>{" "}
              {chartConfig.xAxis || "Not selected"}
            </div>
            <div>
              <span className="font-semibold">Y Axis:</span>{" "}
              {chartConfig.yAxis.length > 0
                ? chartConfig.yAxis.join(", ")
                : "Not selected"}
            </div>
            <div>
              <span className="font-semibold">Show Legend:</span>{" "}
              {chartConfig.showLegend ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-semibold">Show Grid:</span>{" "}
              {chartConfig.showGrid ? "Yes" : "No"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>사용 시나리오 테스트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">시나리오 1: 빠른 차트 생성</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>페이지 로드 시 자동으로 X축: month, Y축: sales 선택됨</li>
              <li>Bar Chart가 기본으로 표시됨</li>
              <li>필요시 차트 타입을 Line 또는 Pie로 변경</li>
            </ol>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">시나리오 2: 다중 Y축 비교</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>X축: month 선택</li>
              <li>Y축: sales, cost, profit 모두 선택</li>
              <li>차트 타입: Line Chart로 변경</li>
              <li>세 지표를 한눈에 비교하여 추세 파악</li>
            </ol>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">시나리오 3: 차트 타입 전환</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Bar Chart로 카테고리별 비교</li>
              <li>Line Chart로 추세 확인</li>
              <li>Pie Chart로 비율 확인 (Y축 1개만 선택 필요)</li>
              <li>같은 데이터, 다른 시각화로 다양한 인사이트 도출</li>
            </ol>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">검증 포인트</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>X축 드롭다운에 {'"month"'}만 표시되는가?</li>
              <li>
                Y축 체크박스에 {'"sales"'}, {'"cost"'}, {'"profit"'}만
                표시되는가?
              </li>
              <li>차트 타입 변경 시 즉시 반영되는가?</li>
              <li>여러 Y축 선택 시 모두 차트에 표시되는가?</li>
              <li>범례와 그리드 옵션이 정상 작동하는가?</li>
              <li>Reset Settings 버튼이 초기 상태로 되돌리는가?</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Sales</th>
                  <th className="text-right p-2">Cost</th>
                  <th className="text-right p-2">Profit</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row) => (
                  <tr key={row.month} className="border-b">
                    <td className="p-2">{row.month}</td>
                    <td className="text-right p-2">{row.sales}</td>
                    <td className="text-right p-2">{row.cost}</td>
                    <td className="text-right p-2">{row.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analyzed Column Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {columnInfos.map((col) => (
              <div key={col.name} className="flex justify-between">
                <span className="font-mono">{col.name}</span>
                <span className="text-muted-foreground">{col.type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
