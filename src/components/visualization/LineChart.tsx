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
import { ChartConfig, ChartData } from "@/types/chart";

interface LineChartProps {
  data: ChartData[];
  config: ChartConfig;
}

const DEFAULT_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

export default function LineChart({ data, config }: LineChartProps) {
  const colors = config.colors || DEFAULT_COLORS;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLine
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={config.xAxis} />
        <YAxis />
        <Tooltip />
        {config.showLegend && <Legend />}
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
