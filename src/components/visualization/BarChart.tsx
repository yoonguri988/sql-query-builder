"use client";

import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getChartColors } from "@/lib/chart/chart-theme";
import CustomTooltip from "./CustomTooltip";
import { ChartConfig, ChartData } from "@/types/chart";
import { useDarkMode } from "@/hooks/useDarkMode";

interface BarChartProps {
  data: ChartData[];
  config: ChartConfig;
}

export default function BarChart({ data, config }: BarChartProps) {
  const isDark = useDarkMode();
  const colors = config.colors || getChartColors(isDark).primary;
  const themeColors = getChartColors(isDark);

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="min-h-[300px] h-[400px]"
    >
      <RechartsBar
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
          <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
        ))}
      </RechartsBar>
    </ResponsiveContainer>
  );
}
