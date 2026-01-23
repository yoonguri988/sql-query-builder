import { TableData, CellValue } from "@/types/table";
import { ChartData } from "@/types/chart";

export type ColumnType = "numeric" | "text" | "date" | "boolean";

export interface ColumnInfo {
  name: string;
  type: ColumnType;
  sampleValues: CellValue[];
}

/**
 * 컬럼의 데이터 타입 감지
 */
export function detectColumnType(values: CellValue[]): ColumnType {
  const nonNullValues = values.filter((v) => v !== null);

  if (nonNullValues.length === 0) {
    return "text";
  }

  const allNumeric = nonNullValues.every((v) => typeof v === "number");
  if (allNumeric) {
    return "numeric";
  }

  const allBoolean = nonNullValues.every((v) => typeof v === "boolean");
  if (allBoolean) {
    return "boolean";
  }

  const allDate = nonNullValues.every((v) => {
    if (typeof v !== "string") return false;
    const date = new Date(v);
    return !isNaN(date.getTime());
  });
  if (allDate) {
    return "date";
  }

  return "text";
}

/**
 * 쿼리 결과의 모든 컬럼 분석
 */
export function analyzeQueryResult(data: TableData[]): ColumnInfo[] {
  if (data.length === 0) {
    return [];
  }

  const columns = Object.keys(data[0]);
  const columnInfos: ColumnInfo[] = [];

  for (const column of columns) {
    const values = data.map((row) => row[column]);
    const type = detectColumnType(values);
    const sampleValues = values.slice(0, 5);

    columnInfos.push({
      name: column,
      type,
      sampleValues,
    });
  }

  return columnInfos;
}

/**
 * 차트에 적합한 X축/Y축 컬럼 추천
 */
export function recommendChartAxes(columnInfos: ColumnInfo[]): {
  xAxisCandidates: string[];
  yAxisCandidates: string[];
} {
  const xAxisCandidates = columnInfos
    .filter((col) => col.type === "text" || col.type === "date")
    .map((col) => col.name);

  const yAxisCandidates = columnInfos
    .filter((col) => col.type === "numeric")
    .map((col) => col.name);

  return {
    xAxisCandidates,
    yAxisCandidates,
  };
}

/**
 * TableData를 ChartData로 변환
 */
export function transformToChartData(data: TableData[]): ChartData[] {
  return data.map((row) => {
    const chartRow: ChartData = {};
    for (const [key, value] of Object.entries(row)) {
      if (
        value === null ||
        value === undefined ||
        value instanceof Uint8Array
      ) {
        chartRow[key] = "";
        continue;
      }

      if (
        typeof value === "string" &&
        value.trim() !== "" &&
        !isNaN(Number(value))
      ) {
        chartRow[key] = Number(value);
      } else if (typeof value === "number" || typeof value === "string") {
        chartRow[key] = value;
      } else {
        chartRow[key] = String(value);
      }
    }
    return chartRow;
  });
}
