import { create } from "zustand";
import { ChartType, ChartConfig } from "@/types/chart";

interface ChartState {
  chartConfig: ChartConfig; // 차트 설정 상태
  setChartType: (type: ChartType) => void; // 차트 타입 설정
  setXAxis: (column: string) => void; // x축 컬럼 설정
  setYAxis: (columns: string[]) => void; // y축 컬럼 배열 설정
  toggleYAxis: (column: string) => void; // y축 컬럼 토글 (추가/제거)
  setShowLegend: (show: boolean) => void; // 범례 표시 여부
  setShowGrid: (show: boolean) => void; // 그리드 표시 여부
  resetChartConfig: () => void; // 차트 설정 초기화
}

const defaultConfig: ChartConfig = {
  type: "bar",
  xAxis: "",
  yAxis: [],
  showLegend: true,
  showGrid: true,
};

export const useChartStore = create<ChartState>((set) => ({
  chartConfig: defaultConfig,

  setChartType: (type) =>
    set((state) => ({
      chartConfig: { ...state.chartConfig, type },
    })),

  setXAxis: (column) =>
    set((state) => ({
      chartConfig: { ...state.chartConfig, xAxis: column },
    })),

  setYAxis: (columns) =>
    set((state) => ({
      chartConfig: { ...state.chartConfig, yAxis: columns },
    })),

  toggleYAxis: (column) =>
    set((state) => {
      const current = state.chartConfig.yAxis;
      const updated = current.includes(column)
        ? current.filter((c) => c !== column)
        : [...current, column];

      return {
        chartConfig: { ...state.chartConfig, yAxis: updated },
      };
    }),

  setShowLegend: (show) =>
    set((state) => ({
      chartConfig: { ...state.chartConfig, showLegend: show },
    })),

  setShowGrid: (show) =>
    set((state) => ({
      chartConfig: { ...state.chartConfig, showGrid: show },
    })),

  resetChartConfig: () => set({ chartConfig: defaultConfig }),
}));
