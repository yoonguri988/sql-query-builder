import { describe, it, expect } from "vitest";
import {
  detectColumnType,
  analyzeQueryResult,
  recommendChartAxes,
  transformToChartData,
} from "../data-analyzer";
import { CellValue } from "@/types/table";

describe("data-analyzer", () => {
  describe("detectColumnType", () => {
    it("숫자형 컬럼 감지", () => {
      const values: CellValue[] = [100, 200, 300, null];
      expect(detectColumnType(values)).toBe("numeric");
    });

    it("텍스트형 컬럼 감지", () => {
      const values: CellValue[] = ["apple", "banana", "cherry"];
      expect(detectColumnType(values)).toBe("text");
    });

    it("불리언형 컬럼 감지", () => {
      const values: CellValue[] = [true, false, true, null];
      expect(detectColumnType(values)).toBe("boolean");
    });

    it("날짜형 컬럼 감지", () => {
      const values: CellValue[] = ["2024-01-01", "2024-02-01", "2024-03-01"];
      expect(detectColumnType(values)).toBe("date");
    });

    it("빈 배열은 text로 반환", () => {
      const values: CellValue[] = [];
      expect(detectColumnType(values)).toBe("text");
    });

    it("모두 null인 경우 text로 반환", () => {
      const values: CellValue[] = [null, null, null];
      expect(detectColumnType(values)).toBe("text");
    });
  });

  describe("analyzeQueryResult", () => {
    it("쿼리 결과 분석", () => {
      const data = [
        { name: "John", age: 30, email: "john@example.com" },
        { name: "Jane", age: 25, email: "jane@example.com" },
      ];

      const result = analyzeQueryResult(data);
      expect(result).toHaveLength(3);
      expect(result[0].type).toBe("text");
      expect(result[1].type).toBe("numeric");
      expect(result[2].type).toBe("text");
    });

    it("빈 배열은 빈 결과 반환", () => {
      const data: Array<Record<string, CellValue>> = [];
      const result = analyzeQueryResult(data);
      expect(result).toHaveLength(0);
    });

    it("샘플 값이 최대 5개까지 저장됨", () => {
      const data = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
      ];

      const result = analyzeQueryResult(data);
      expect(result[0].sampleValues).toHaveLength(5);
      expect(result[0].sampleValues).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("recommendChartAxes", () => {
    it("차트 축 추천", () => {
      const columnInfos = [
        { name: "category", type: "text" as const, sampleValues: [] },
        { name: "sales", type: "numeric" as const, sampleValues: [] },
        { name: "revenue", type: "numeric" as const, sampleValues: [] },
      ];

      const result = recommendChartAxes(columnInfos);
      expect(result.xAxisCandidates).toContain("category");
      expect(result.yAxisCandidates).toContain("sales");
      expect(result.yAxisCandidates).toContain("revenue");
    });

    it("날짜형 컬럼도 X축 후보에 포함", () => {
      const columnInfos = [
        { name: "date", type: "date" as const, sampleValues: [] },
        { name: "amount", type: "numeric" as const, sampleValues: [] },
      ];

      const result = recommendChartAxes(columnInfos);
      expect(result.xAxisCandidates).toContain("date");
      expect(result.yAxisCandidates).toContain("amount");
    });

    it("적합한 컬럼이 없는 경우 빈 배열 반환", () => {
      const columnInfos = [
        { name: "flag", type: "boolean" as const, sampleValues: [] },
      ];

      const result = recommendChartAxes(columnInfos);
      expect(result.xAxisCandidates).toHaveLength(0);
      expect(result.yAxisCandidates).toHaveLength(0);
    });
  });

  describe("transformToChartData", () => {
    it("TableData를 ChartData로 변환", () => {
      const data = [
        { name: "A", value: 100 },
        { name: "B", value: 200 },
      ];

      const result = transformToChartData(data);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ name: "A", value: 100 });
    });

    it("숫자형 문자열을 숫자로 변환", () => {
      const data = [
        { name: "A", value: "100" },
        { name: "B", value: "200" },
      ];

      const result = transformToChartData(data);
      expect(result[0].value).toBe(100);
      expect(result[1].value).toBe(200);
      expect(typeof result[0].value).toBe("number");
    });

    it("일반 문자열은 그대로 유지", () => {
      const data = [{ name: "Apple", category: "Fruit" }];

      const result = transformToChartData(data);
      expect(result[0].name).toBe("Apple");
      expect(result[0].category).toBe("Fruit");
      expect(typeof result[0].name).toBe("string");
    });

    it("빈 배열은 빈 결과 반환", () => {
      const data: Array<Record<string, CellValue>> = [];
      const result = transformToChartData(data);
      expect(result).toHaveLength(0);
    });
  });
});
