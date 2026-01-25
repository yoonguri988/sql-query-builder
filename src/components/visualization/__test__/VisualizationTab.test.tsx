import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import VisualizationTab from "../VisualizationTab";
import { useQueryStore } from "@/store/query-store";
import { useChartStore } from "@/store/chart-store";

describe("VisualizationTab", () => {
  beforeEach(() => {
    useQueryStore.setState({
      queryResult: null,
    });
    useChartStore.setState({
      chartConfig: {
        type: "bar",
        xAxis: "",
        yAxis: [],
        showLegend: true,
        showGrid: true,
      },
    });
  });

  it("쿼리 결과가 없을 때 안내 메시지 표시", () => {
    render(<VisualizationTab />);
    expect(
      screen.getByText(/쿼리를 실행하면 결과를 차트로 시각화할 수 있습니다/)
    ).toBeInTheDocument();
  });

  it("쿼리 결과가 있을 때 차트 설정 표시", () => {
    useQueryStore.setState({
      queryResult: {
        columns: ["category", "sales"],
        data: [
          { category: "A", sales: 100 },
          { category: "B", sales: 200 },
        ],
        rowCount: 2,
      },
    });

    render(<VisualizationTab />);
    expect(screen.getByText(/Chart Type/i)).toBeInTheDocument();
    expect(screen.getByText(/X Axis/i)).toBeInTheDocument();
  });
});
