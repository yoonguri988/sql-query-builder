"use client";

import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getChartColors } from "@/lib/chart/chart-theme";
import CustomTooltip from "./CustomTooltip";
import { ChartConfig, ChartData } from "@/types/chart";
import { useDarkMode } from "@/hooks/useDarkMode";
import { memo } from "react";

interface LineChartProps {
  data: ChartData[];
  config: ChartConfig;
}

function LineChart({ data, config }: LineChartProps) {
  const isDark = useDarkMode();
  const colors = config.colors || getChartColors(isDark).primary;
  const themeColors = getChartColors(isDark);

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="min-h-[300px] h-[400px]"
    >
      <RechartsLine
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {config.showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
        )}
        <XAxis
          dataKey={config.xAxis}
          stroke={themeColors.text}
          tick={{ fill: themeColors.text }}
        />
        <YAxis stroke={themeColors.text} tick={{ fill: themeColors.text }} />
        <Tooltip content={<CustomTooltip />} />
        {config.showLegend && (
          <Legend wrapperStyle={{ color: themeColors.text }} />
        )}
        {config.yAxis.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
          />
        ))}
      </RechartsLine>
    </ResponsiveContainer>
  );
}
export default memo(LineChart);
