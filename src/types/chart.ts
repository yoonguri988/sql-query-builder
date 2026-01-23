export type ChartType = "bar" | "line" | "pie" | "area" | "scatter";

export interface ChartConfig {
  type: ChartType;
  xAxis: string;
  yAxis: string[];
  title?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
}

export interface ChartData {
  [key: string]: string | number;
}
