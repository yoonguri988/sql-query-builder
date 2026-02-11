"use client";

import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getChartColors } from "@/lib/chart/chart-theme";
import CustomTooltip from "./CustomTooltip";
import { ChartConfig, ChartData } from "@/types/chart";
import { useDarkMode } from "@/hooks/useDarkMode";
import { memo } from "react";

interface PieChartProps {
  data: ChartData[];
  config: ChartConfig;
}

function PieChart({ data, config }: PieChartProps) {
  const isDark = useDarkMode();
  const colors = config.colors || getChartColors(isDark).primary;
  const themeColors = getChartColors(isDark);

  const valueKey = config.yAxis[0];
  const nameKey = config.xAxis;

  return (
    <ResponsiveContainer
      width="100%"
      height={320}
      className="sm:h-[400px] md:h-[450px] lg:h-[500px]"
    >
      <RechartsPie>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {config.showLegend && (
          <Legend wrapperStyle={{ color: themeColors.text }} />
        )}
      </RechartsPie>
    </ResponsiveContainer>
  );
}
export default memo(PieChart);
