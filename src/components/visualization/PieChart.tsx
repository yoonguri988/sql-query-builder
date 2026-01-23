"use client";

import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartData } from "@/types/chart";

interface PieChartProps {
  data: ChartData[];
  config: ChartConfig;
}

const DEFAULT_COLORS = ["#9112BC", "#3561F0", "#EE7EF0", "#F03E35", "#000000"];

export default function PieChart({ data, config }: PieChartProps) {
  const colors = config.colors || DEFAULT_COLORS;

  const valueKey = config.yAxis[0];
  const nameKey = config.xAxis;

  return (
    <ResponsiveContainer width="100%" height={400}>
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
        <Tooltip />
        {config.showLegend && <Legend />}
      </RechartsPie>
    </ResponsiveContainer>
  );
}
