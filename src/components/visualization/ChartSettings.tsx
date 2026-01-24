"use client";

import { useChartStore } from "@/store/chart-store";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartType } from "@/types/chart";
import { ColumnInfo } from "@/lib/chart/data-analyzer";

interface ChartSettingsProps {
  columnInfos: ColumnInfo[];
  xAxisCandidates: string[];
  yAxisCandidates: string[];
}

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "pie", label: "Pie Chart" },
];

export default function ChartSettings({
  xAxisCandidates,
  yAxisCandidates,
}: ChartSettingsProps) {
  const {
    chartConfig,
    setChartType,
    setXAxis,
    toggleYAxis,
    setShowLegend,
    setShowGrid,
  } = useChartStore();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Chart Type</Label>
        <RadioGroup
          value={chartConfig.type}
          onValueChange={(value: ChartType) => setChartType(value)}
        >
          {CHART_TYPES.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem value={type.value} id={type.value} />
              <Label
                htmlFor={type.value}
                className="font-normal cursor-pointer"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>X Axis</Label>
        <Select value={chartConfig.xAxis} onValueChange={setXAxis}>
          <SelectTrigger>
            <SelectValue placeholder="Select X axis column" />
          </SelectTrigger>
          <SelectContent>
            {xAxisCandidates.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Y Axis (Multiple)</Label>
        <div className="space-y-2">
          {yAxisCandidates.map((column) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={`y-${column}`}
                checked={chartConfig.yAxis.includes(column)}
                onCheckedChange={() => toggleYAxis(column)}
              />
              <Label
                htmlFor={`y-${column}`}
                className="font-normal cursor-pointer"
              >
                {column}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Chart Options</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-legend"
              checked={chartConfig.showLegend}
              onCheckedChange={(checked) => setShowLegend(checked as boolean)}
            />
            <Label htmlFor="show-legend" className="font-normal cursor-pointer">
              Show Legend
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-grid"
              checked={chartConfig.showGrid}
              onCheckedChange={(checked) => setShowGrid(checked as boolean)}
            />
            <Label htmlFor="show-grid" className="font-normal cursor-pointer">
              Show Grid
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
