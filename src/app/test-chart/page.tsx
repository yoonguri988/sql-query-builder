"use client";

import BarChart from "@/components/visualization/BarChart";

const sampleData = [
  { name: "Jan", sales: 4000, revenue: 2400 },
  { name: "Feb", sales: 3000, revenue: 1398 },
  { name: "Mar", sales: 2000, revenue: 9800 },
  { name: "Apr", sales: 2780, revenue: 3908 },
  { name: "May", sales: 1890, revenue: 4800 },
];

export default function TestChartPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bar Chart Test</h1>
      <BarChart
        data={sampleData}
        config={{
          type: "bar",
          xAxis: "name",
          yAxis: ["sales", "revenue"],
          showGrid: true,
          showLegend: true,
        }}
      />
    </div>
  );
}
