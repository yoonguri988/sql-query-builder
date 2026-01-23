import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

// 각 테스트 후 자동 정리
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// 모든 테스트 시작 전 설정
beforeAll(() => {
  // Performance API 모킹 (Node.js 환경용)
  if (typeof global.performance === "undefined") {
    global.performance = {
      now: () => Date.now(),
      mark: vi.fn(),
      measure: vi.fn(),
      clearMarks: vi.fn(),
      clearMeasures: vi.fn(),
      getEntriesByName: vi.fn(() => []),
      getEntriesByType: vi.fn(() => []),
    } as unknown as Performance;
  }
});

// ========================================
// SQL.js 모킹 (더 현실적인 구현)
// ========================================
vi.mock("sql.js", () => {
  const mockDatabase = {
    run: vi.fn(),
    exec: vi.fn((sql: string) => {
      // SELECT 쿼리 시뮬레이션
      if (sql.toLowerCase().includes("select")) {
        return [
          {
            columns: ["id", "name", "email"],
            values: [
              [1, "John Doe", "john@example.com"],
              [2, "Jane Smith", "jane@example.com"],
            ],
          },
        ];
      }
      // INSERT, UPDATE, DELETE는 빈 배열 반환
      return [];
    }),
    close: vi.fn(),
    export: vi.fn(() => new Uint8Array()),
  };

  return {
    default: vi.fn(() =>
      Promise.resolve({
        Database: vi.fn(() => mockDatabase),
      })
    ),
  };
});

// ========================================
// localStorage 모킹
// ========================================
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// ========================================
// matchMedia 모킹 (다크모드 테스트용)
// ========================================
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ========================================
// IntersectionObserver 모킹
// ========================================
class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  root = null;
  rootMargin = "";
  thresholds = [];
  takeRecords = vi.fn(() => []);
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(global, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

// ========================================
// ResizeObserver 모킹
// ========================================
class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(global, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

// ========================================
// HTMLElement.scrollIntoView 모킹
// ========================================
Element.prototype.scrollIntoView = vi.fn();

// ========================================
// window.scrollTo 모킹
// ========================================
window.scrollTo = vi.fn();

// ========================================
// Clipboard API 모킹
// ========================================
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve("")),
  },
});

// ========================================
// console 경고 억제 (선택적)
// ========================================
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // React 18의 일부 경고를 억제할 수 있습니다
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("Warning: useLayoutEffect"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("componentWillReceiveProps")
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterEach(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// ========================================
// 전역 타입 확장 (필요시)
// ========================================
declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}
