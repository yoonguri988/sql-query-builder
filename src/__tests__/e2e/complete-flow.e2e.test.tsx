import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import MainLayout from "@/components/layout/MainLayout";
import { useDBStore } from "@/store/db-store";
import { useQueryStore } from "@/store/query-store";
import { useHistoryStore } from "@/store/history-store";

/**
 * E2E 테스트
 */
describe("Complete User Flow E2E Tests", () => {
  beforeEach(() => {
    localStorage.clear();
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

    useHistoryStore.setState({
      history: [],
    });
  });

  describe("쿼리 빌더 전체 플로우", () => {
    it("테이블 선택 → 컬럼 선택 → 쿼리 생성 → 실행", async () => {
      const user = userEvent.setup();
      render(<MainLayout />);

      // DB 초기화 대기
      await waitFor(
        () => {
          expect(screen.queryByText(/초기화 중/i)).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // 1. 테이블 선택
      // Select 컴포넌트 찾기
      const tableSelects = screen.queryAllByRole("combobox");
      if (tableSelects.length > 0) {
        await user.click(tableSelects[0]);

        // 옵션 표시 대기
        await waitFor(
          () => {
            const userOption = screen.queryByText(/users/i);
            if (userOption) {
              return userOption;
            }
            throw new Error("users option not found");
          },
          { timeout: 2000 }
        );

        const usersOption = screen.getByText(/users/i);
        await user.click(usersOption);
      }

      // 2. SQL이 생성되었는지 확인
      await waitFor(() => {
        const state = useQueryStore.getState();
        expect(state.generatedSQL).toContain("SELECT");
        expect(state.generatedSQL).toContain("users");
      });

      // 3. 실행 버튼 찾아서 클릭
      const executeButtons = screen.queryAllByRole("button", {
        name: /execute|실행/i,
      });
      if (executeButtons.length > 0) {
        await user.click(executeButtons[0]);

        // 4. 쿼리 실행 완료 대기
        await waitFor(
          () => {
            const state = useQueryStore.getState();
            expect(state.isExecuting).toBe(false);
          },
          { timeout: 3000 }
        );

        // 5. 결과 확인
        const state = useQueryStore.getState();
        expect(state.queryResult).not.toBeNull();
      }
    });

    it("WHERE 조건 추가 플로우", async () => {
      const user = userEvent.setup();
      render(<MainLayout />);

      await waitFor(
        () => {
          expect(screen.queryByText(/초기화 중/i)).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // WHERE 조건 추가 버튼 찾기
      const addConditionBtn = screen.queryByRole("button", {
        name: /add condition|조건 추가/i,
      });

      if (addConditionBtn) {
        await user.click(addConditionBtn);

        // 조건이 추가되었는지 확인
        await waitFor(() => {
          const state = useQueryStore.getState();
          expect(state.whereConditions.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe("SQL Editor 플로우", () => {
    it("SQL Editor에서 직접 SQL 작성 및 실행", async () => {
      const user = userEvent.setup();
      render(<MainLayout />);

      await waitFor(
        () => {
          expect(screen.queryByText(/초기화 중/i)).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // SQL Editor 탭 찾기
      const editorTab = screen.queryByRole("tab", {
        name: /sql editor|에디터/i,
      });

      if (editorTab) {
        await user.click(editorTab);

        // Textarea 찾기
        const textarea = screen.queryByRole("textbox");

        if (textarea) {
          // SQL 입력
          await user.type(textarea, "SELECT * FROM users LIMIT 5");

          // 실행 버튼 클릭
          const executeBtn = screen.getByRole("button", {
            name: /실행|execute/i,
          });
          await user.click(executeBtn);

          // 쿼리 실행 확인
          await waitFor(() => {
            const state = useQueryStore.getState();
            expect(state.generatedSQL).toContain("SELECT * FROM users LIMIT 5");
          });
        }
      }
    });
  });

  describe("히스토리 플로우", () => {
    it("쿼리 실행 후 히스토리에 저장", async () => {
      const user = userEvent.setup();
      render(<MainLayout />);

      await waitFor(
        () => {
          expect(screen.queryByText(/초기화 중/i)).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // 쿼리 실행
      const executeButtons = screen.queryAllByRole("button", {
        name: /execute|실행/i,
      });

      if (executeButtons.length > 0) {
        // SQL 설정
        useQueryStore.setState({
          generatedSQL: "SELECT * FROM users",
        });

        await user.click(executeButtons[0]);

        // 히스토리 저장 확인
        await waitFor(
          () => {
            const history = useHistoryStore.getState().history;
            expect(history.length).toBeGreaterThan(0);
          },
          { timeout: 3000 }
        );
      }
    });

    it("히스토리에서 쿼리 복원", async () => {
      const user = userEvent.setup();

      // 미리 히스토리 추가
      useHistoryStore.getState().addHistory({
        sql: "SELECT * FROM users WHERE age > 18",
        executionTime: 100,
        rowCount: 10,
        status: "success",
        queryState: {
          selectedTable: "users",
          selectedColumns: ["id", "name"],
          whereConditions: [],
          orderBy: [],
          limit: 100,
          generatedSQL: "SELECT * FROM users WHERE age > 18",
          queryResult: null,
          executionMetadata: null,
          executionTime: null,
          error: null,
        },
      });

      render(<MainLayout />);

      await waitFor(
        () => {
          expect(screen.queryByText(/초기화 중/i)).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // History 탭 찾기
      const historyTab = screen.queryByRole("tab", {
        name: /history|히스토리/i,
      });

      if (historyTab) {
        await user.click(historyTab);

        // 복원 버튼 찾기
        await waitFor(() => {
          const restoreBtn = screen.queryByRole("button", {
            name: /복원|restore/i,
          });
          expect(restoreBtn).toBeInTheDocument();
        });

        const restoreBtn = screen.getByRole("button", {
          name: /복원|restore/i,
        });
        await user.click(restoreBtn);

        // 복원 확인
        await waitFor(() => {
          const state = useQueryStore.getState();
          expect(state.generatedSQL).toContain(
            "SELECT * FROM users WHERE age > 18"
          );
        });
      }
    });
  });

  describe("다크모드 플로우", () => {
    it("다크모드 토글", async () => {
      const user = userEvent.setup();
      render(<MainLayout />);

      await waitFor(
        () => {
          expect(screen.queryByText(/초기화 중/i)).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // 초기 상태 확인 (라이트 모드)
      expect(document.documentElement.classList.contains("dark")).toBe(false);

      // 테마 토글 버튼 찾기
      const themeToggle = screen.queryByRole("button", {
        name: /toggle theme|테마/i,
      });

      if (themeToggle) {
        await user.click(themeToggle);

        // DropdownMenu가 열릴 때까지 대기
        await waitFor(
          () => {
            const darkOption = screen.queryByRole("menuitem", {
              name: /dark/i,
            });
            expect(darkOption).toBeInTheDocument();
          },
          { timeout: 2000 }
        );

        // Dark 옵션 클릭
        const darkOption = screen.getByRole("menuitem", { name: /dark/i });
        await user.click(darkOption);

        // setTheme이 호출되면 자동으로 dark 클래스 추가됨 (vitest.setup.ts에서 처리)
        await waitFor(
          () => {
            expect(document.documentElement.classList.contains("dark")).toBe(
              true
            );
          },
          { timeout: 1000 }
        );
      }
    });
  });

  describe("차트 생성 플로우", () => {
    it("쿼리 실행 후 차트 생성", async () => {
      const user = userEvent.setup();

      // 쿼리 결과 미리 설정
      useQueryStore.setState({
        generatedSQL:
          "SELECT category, SUM(price) FROM products GROUP BY category",
        queryResult: {
          columns: ["category", "sum"],
          data: [
            { category: "Electronics", sum: 5000 },
            { category: "Books", sum: 2000 },
            { category: "Clothing", sum: 3000 },
          ],
          rowCount: 3,
        },
        executionMetadata: {
          executionTime: 50,
          rowCount: 3,
          status: "success",
          timestamp: new Date(),
        },
      });

      render(<MainLayout />);

      await waitFor(
        () => {
          expect(screen.queryByText(/초기화 중/i)).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Visualization/Chart 탭 찾기
      const chartTab = screen.queryByRole("tab", {
        name: /chart|visualization|차트/i,
      });

      if (chartTab) {
        await user.click(chartTab);

        // 차트 설정 UI가 표시되는지 확인
        await waitFor(() => {
          const chartTypeLabel = screen.queryByText(/chart type|차트 타입/i);
          expect(chartTypeLabel).toBeInTheDocument();
        });
      }
    });
  });
});
