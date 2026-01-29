/**
 * 컴포넌트 렌더링 시간 측정 유틸리티
 * : 컴포넌트별 성능을 정량적으로 측정하고 최적화 전후를 비교
 */

export function measureRenderTime(
  componentName: string,
  callback: () => void
): number {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const renderTime = endTime - startTime;

  console.log(
    `[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`
  );

  return renderTime;
}

/**
 * 여러 번의 렌더링 시간 평균 측정
 */
export function measureAverageRenderTime(
  componentName: string,
  callback: () => void,
  iterations: number = 10
): { average: number; min: number; max: number } {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    times.push(endTime - startTime);
  }

  const average = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`[Performance] ${componentName} (${iterations} iterations):`);
  console.log(`  Average: ${average.toFixed(2)}ms`);
  console.log(`  Min: ${min.toFixed(2)}ms`);
  console.log(`  Max: ${max.toFixed(2)}ms`);

  return { average, min, max };
}

/**
 * 리렌더링 카운터 (개발 환경에서만 사용)
 */
export function useRenderCount(componentName: string): void {
  if (process.env.NODE_ENV === "development") {
    const renderCount = React.useRef(0);

    React.useEffect(() => {
      renderCount.current += 1;
      console.log(`[Render Count] ${componentName}: ${renderCount.current}`);
    });
  }
}

/**
 * 메모리 사용량 측정 (Chrome only)
 */
export function measureMemoryUsage(label: string): void {
  if (performance.memory) {
    const used = performance.memory.usedJSHeapSize;
    const total = performance.memory.totalJSHeapSize;
    const limit = performance.memory.jsHeapSizeLimit;

    console.log(`[Memory] ${label}:`);
    console.log(`  Used: ${(used / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Total: ${(total / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Limit: ${(limit / 1024 / 1024).toFixed(2)} MB`);
  } else {
    console.log("[Memory] performance.memory not available (Chrome only)");
  }
}

/**
 * 함수 실행 시간 측정
 */
export function measureExecutionTime<T>(fn: () => T, label: string): T {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();

  console.log(`[Execution] ${label}: ${(endTime - startTime).toFixed(2)}ms`);

  return result;
}

/**
 * 비동기 함수 실행 시간 측정
 */
export async function measureAsyncExecutionTime<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();

  console.log(
    `[Async Execution] ${label}: ${(endTime - startTime).toFixed(2)}ms`
  );

  return result;
}

/**
 * 개발 환경에서만 성능 로그 출력
 */
export function devLog(message: string, ...args: unknown[]): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Dev] ${message}`, ...args);
  }
}

// React import for useRenderCount
import React from "react";
