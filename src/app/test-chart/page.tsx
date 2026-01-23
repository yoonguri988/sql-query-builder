"use client";

import BarChart from "@/components/visualization/BarChart";
import LineChart from "@/components/visualization/LineChart";
import PieChart from "@/components/visualization/PieChart";

const sampleData = [
  { name: "Jan", sales: 4000, revenue: 2400 },
  { name: "Feb", sales: 3000, revenue: 1398 },
  { name: "Mar", sales: 2000, revenue: 9800 },
  { name: "Apr", sales: 2780, revenue: 3908 },
  { name: "May", sales: 1890, revenue: 4800 },
];

const pieData = [
  { category: "Electronics", value: 4500 },
  { category: "Clothing", value: 3200 },
  { category: "Food", value: 2800 },
  { category: "Books", value: 1500 },
  { category: "Toys", value: 2000 },
];

export default function TestChartPage() {
  return (
    <div className="p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Charts Test Page</h1>
        <p className="text-muted-foreground mb-8">
          Bar Chart, Line Chart, Pie Chart 동작 확인
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">1. Bar Chart</h2>
        <div className="border rounded-lg p-6 bg-card">
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
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">2. Line Chart</h2>
        <div className="border rounded-lg p-6 bg-card">
          <LineChart
            data={sampleData}
            config={{
              type: "line",
              xAxis: "name",
              yAxis: ["sales", "revenue"],
              showGrid: true,
              showLegend: true,
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">3. Pie Chart</h2>
        <div className="border rounded-lg p-6 bg-card">
          <PieChart
            data={pieData}
            config={{
              type: "pie",
              xAxis: "category",
              yAxis: ["value"],
              showGrid: false,
              showLegend: true,
            }}
          />
        </div>
      </section>
    </div>
  );
}
