import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// 각 테스트 후 자동 정리
afterEach(() => {
  cleanup();
});

// Performance API 모킹 (Node.js 환경용)
if (typeof global.performance === "undefined") {
  global.performance = {
    now: () => Date.now(),
  } as Performance;
}

// SQL.js 로딩 모킹 (테스트 속도 향상)
vi.mock("sql.js", () => ({
  default: vi.fn(() =>
    Promise.resolve({
      Database: vi.fn(() => ({
        run: vi.fn(),
        exec: vi.fn(() => []),
        close: vi.fn(),
      })),
    })
  ),
}));

// 로컬스토리지 모킹
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});
