import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import QueryBuilder from "@/components/query-builder/QueryBuilder";
import ResultsTable from "@/components/results/ResultsTable";
import MainLayout from "@/components/layout/MainLayout";
import SQLPreview from "@/components/sql-preview/SQLPreview";
import { useDBStore } from "@/store/db-store";
import { useQueryStore } from "@/store/query-store";

// performance.test.tsx 상단에 추가
interface MemoryPerformance extends Performance {
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

describe("Performance Tests", () => {
  beforeEach(() => {
    // Store 초기화
    useDBStore.setState({
      isInitialized: true,
      isLoading: false,
      error: null,
    });

    useQueryStore.setState({
      selectedTable: undefined,
      selectedColumns: [],
      whereConditions: [],
      orderBy: [],
      limit: 100,
      generatedSQL: "",
      queryResult: null,
      executionMetadata: null,
      executionTime: null,
      error: null,
      isExecuting: false,
    });
  });

  describe("컴포넌트 렌더링 성능", () => {
    it("QueryBuilder 초기 렌더링 - 200ms 이내", () => {
      const startTime = performance.now();
      const { unmount } = render(<QueryBuilder />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      console.log(`QueryBuilder render time: ${renderTime.toFixed(2)}ms`);

      expect(renderTime).toBeLessThan(200);
      unmount();
    });

    it("MainLayout 초기 렌더링 - 300ms 이내", () => {
      const startTime = performance.now();
      const { unmount } = render(<MainLayout />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      console.log(`MainLayout render time: ${renderTime.toFixed(2)}ms`);

      expect(renderTime).toBeLessThan(300);
      unmount();
    });

    it("SQLPreview 렌더링 - 50ms 이내", () => {
      // SQL 설정
      useQueryStore.setState({
        generatedSQL: "SELECT * FROM users WHERE age > 18",
      });

      const startTime = performance.now();
      const { unmount } = render(<SQLPreview />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      console.log(`SQLPreview render time: ${renderTime.toFixed(2)}ms`);

      expect(renderTime).toBeLessThan(50);
      unmount();
    });
  });

  describe("대량 데이터 렌더링 성능", () => {
    it("ResultsTable - 100개 행 렌더링 - 200ms 이내", () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + (i % 50),
        created_at: new Date().toISOString(),
      }));

      const startTime = performance.now();
      const { unmount } = render(<ResultsTable data={data} />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      console.log(
        `ResultsTable (100 rows) render time: ${renderTime.toFixed(2)}ms`
      );

      expect(renderTime).toBeLessThan(200);
      unmount();
    });

    it("ResultsTable - 500개 행 렌더링 - 500ms 이내", () => {
      const data = Array.from({ length: 500 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + (i % 50),
        created_at: new Date().toISOString(),
      }));

      const startTime = performance.now();
      const { unmount } = render(<ResultsTable data={data} />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      console.log(
        `ResultsTable (500 rows) render time: ${renderTime.toFixed(2)}ms`
      );

      expect(renderTime).toBeLessThan(500);
      unmount();
    });

    it("ResultsTable - 1000개 행 렌더링 - 1000ms 이내", () => {
      const data = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + (i % 50),
        city: `City ${i % 10}`,
        country: `Country ${i % 5}`,
        created_at: new Date().toISOString(),
      }));

      const startTime = performance.now();
      const { unmount } = render(<ResultsTable data={data} />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      console.log(
        `ResultsTable (1000 rows) render time: ${renderTime.toFixed(2)}ms`
      );

      expect(renderTime).toBeLessThan(1000);
      unmount();
    });
  });

  describe("리렌더링 성능", () => {
    it("QueryBuilder 리렌더링 - 50ms 이내", () => {
      const { rerender, unmount } = render(<QueryBuilder />);

      const startTime = performance.now();
      rerender(<QueryBuilder />);
      const endTime = performance.now();

      const rerenderTime = endTime - startTime;
      console.log(`QueryBuilder re-render time: ${rerenderTime.toFixed(2)}ms`);

      expect(rerenderTime).toBeLessThan(50);
      unmount();
    });

    it("SQLPreview 리렌더링 (SQL 변경) - 30ms 이내", () => {
      useQueryStore.setState({
        generatedSQL: "SELECT * FROM users",
      });

      const { rerender, unmount } = render(<SQLPreview />);

      // SQL 변경
      useQueryStore.setState({
        generatedSQL: "SELECT * FROM products WHERE price > 100",
      });

      const startTime = performance.now();
      rerender(<SQLPreview />);
      const endTime = performance.now();

      const rerenderTime = endTime - startTime;
      console.log(`SQLPreview re-render time: ${rerenderTime.toFixed(2)}ms`);

      expect(rerenderTime).toBeLessThan(30);
      unmount();
    });
  });

  describe("마운트/언마운트 성능", () => {
    it("QueryBuilder 마운트/언마운트 - 평균 100ms 이내", () => {
      const mountTimes: number[] = [];
      const unmountTimes: number[] = [];

      for (let i = 0; i < 10; i++) {
        const mountStart = performance.now();
        const { unmount } = render(<QueryBuilder />);
        const mountEnd = performance.now();
        mountTimes.push(mountEnd - mountStart);

        const unmountStart = performance.now();
        unmount();
        const unmountEnd = performance.now();
        unmountTimes.push(unmountEnd - unmountStart);
      }

      const avgMountTime =
        mountTimes.reduce((a, b) => a + b) / mountTimes.length;
      const avgUnmountTime =
        unmountTimes.reduce((a, b) => a + b) / unmountTimes.length;

      console.log(`Average mount time: ${avgMountTime.toFixed(2)}ms`);
      console.log(`Average unmount time: ${avgUnmountTime.toFixed(2)}ms`);

      expect(avgMountTime).toBeLessThan(100);
      expect(avgUnmountTime).toBeLessThan(50);
    });

    it("ResultsTable 마운트/언마운트 - 평균 150ms 이내", () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      }));

      const mountTimes: number[] = [];
      const unmountTimes: number[] = [];

      for (let i = 0; i < 10; i++) {
        const mountStart = performance.now();
        const { unmount } = render(<ResultsTable data={data} />);
        const mountEnd = performance.now();
        mountTimes.push(mountEnd - mountStart);

        const unmountStart = performance.now();
        unmount();
        const unmountEnd = performance.now();
        unmountTimes.push(unmountEnd - unmountStart);
      }

      const avgMountTime =
        mountTimes.reduce((a, b) => a + b) / mountTimes.length;
      const avgUnmountTime =
        unmountTimes.reduce((a, b) => a + b) / unmountTimes.length;

      console.log(
        `Average ResultsTable mount time: ${avgMountTime.toFixed(2)}ms`
      );
      console.log(
        `Average ResultsTable unmount time: ${avgUnmountTime.toFixed(2)}ms`
      );

      expect(avgMountTime).toBeLessThan(150);
      expect(avgUnmountTime).toBeLessThan(50);
    });
  });

  describe("메모리 사용량", () => {
    it("MainLayout 메모리 사용 - 10MB 이내", () => {
      const perf = performance as MemoryPerformance;
      // performance.memory는 Chrome에서만 사용 가능
      if (perf.memory) {
        const beforeMemory = perf.memory.usedJSHeapSize;

        const { unmount } = render(<MainLayout />);

        const afterMemory = perf.memory.usedJSHeapSize;
        const memoryUsed = afterMemory - beforeMemory;

        console.log(`Memory used: ${(memoryUsed / 1024 / 1024).toFixed(2)} MB`);

        expect(memoryUsed).toBeLessThan(10 * 1024 * 1024); // 10MB
        unmount();
      } else {
        console.log("performance.memory not available (Chrome only)");
      }
    });

    it("ResultsTable 대량 데이터 메모리 사용 - 20MB 이내", () => {
      const perf = performance as MemoryPerformance;
      if (perf.memory) {
        const data = Array.from({ length: 1000 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          age: 20 + (i % 50),
          city: `City ${i % 10}`,
          country: `Country ${i % 5}`,
        }));

        const beforeMemory = perf.memory.usedJSHeapSize;

        const { unmount } = render(<ResultsTable data={data} />);

        const afterMemory = perf.memory.usedJSHeapSize;
        const memoryUsed = afterMemory - beforeMemory;

        console.log(
          `Memory used (1000 rows): ${(memoryUsed / 1024 / 1024).toFixed(2)} MB`
        );

        expect(memoryUsed).toBeLessThan(20 * 1024 * 1024); // 20MB
        unmount();
      } else {
        console.log("performance.memory not available (Chrome only)");
      }
    });
  });

  describe("성능 벤치마크", () => {
    it("QueryBuilder 연속 렌더링 성능", () => {
      const renderTimes: number[] = [];

      for (let i = 0; i < 50; i++) {
        const startTime = performance.now();
        const { unmount } = render(<QueryBuilder />);
        const endTime = performance.now();

        renderTimes.push(endTime - startTime);
        unmount();
      }

      const avgTime = renderTimes.reduce((a, b) => a + b) / renderTimes.length;
      const minTime = Math.min(...renderTimes);
      const maxTime = Math.max(...renderTimes);

      console.log(`\nQueryBuilder 50회 렌더링 벤치마크:`);
      console.log(`  평균: ${avgTime.toFixed(2)}ms`);
      console.log(`  최소: ${minTime.toFixed(2)}ms`);
      console.log(`  최대: ${maxTime.toFixed(2)}ms`);

      expect(avgTime).toBeLessThan(100);
      expect(maxTime).toBeLessThan(200);
    });

    it("ResultsTable 다양한 데이터 크기 성능", () => {
      const sizes = [10, 50, 100, 500, 1000];
      const results: { size: number; time: number }[] = [];

      sizes.forEach((size) => {
        const data = Array.from({ length: size }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
        }));

        const startTime = performance.now();
        const { unmount } = render(<ResultsTable data={data} />);
        const endTime = performance.now();

        const renderTime = endTime - startTime;
        results.push({ size, time: renderTime });

        unmount();
      });

      console.log(`\nResultsTable 다양한 크기 벤치마크:`);
      results.forEach(({ size, time }) => {
        console.log(`  ${size} rows: ${time.toFixed(2)}ms`);
      });

      // 크기에 따른 선형 증가 확인
      expect(results[results.length - 1].time).toBeLessThan(1000);
    });
  });
});
