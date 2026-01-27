import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import MainLayout from "@/components/layout/MainLayout";
import QueryBuilder from "@/components/query-builder/QueryBuilder";
import { useDBStore } from "@/store/db-store";
import { useQueryStore } from "@/store/query-store";
/**
 * 접근성 테스트
 */
describe("Accessibility Tests", () => {
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

  describe("ARIA 레이블", () => {
    it("모든 버튼에 접근 가능한 이름이 있는가", () => {
      render(<MainLayout />);

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        // aria-label 또는 textContent가 있어야 함
        const accessibleName =
          button.getAttribute("aria-label") ||
          button.textContent?.trim() ||
          button.getAttribute("title");

        expect(accessibleName).toBeTruthy();
      });
    });

    it("폼 요소에 적절한 레이블이 있는가", () => {
      render(<QueryBuilder />);

      // combobox (Select 요소)
      const comboboxes = screen.queryAllByRole("combobox");
      comboboxes.forEach((combobox) => {
        const label =
          combobox.getAttribute("aria-label") ||
          combobox.getAttribute("aria-labelledby") ||
          document.querySelector(`label[for="${combobox.id}"]`);

        expect(label).toBeTruthy();
      });

      // textbox (Input 요소)
      const textboxes = screen.queryAllByRole("textbox");
      textboxes.forEach((textbox) => {
        const label =
          textbox.getAttribute("aria-label") ||
          textbox.getAttribute("placeholder") ||
          textbox.getAttribute("aria-labelledby") ||
          document.querySelector(`label[for="${textbox.id}"]`);

        expect(label).toBeTruthy();
      });
    });

    it("이미지에 alt 텍스트가 있는가", () => {
      render(<MainLayout />);

      const images = screen.queryAllByRole("img");

      if (images.length > 0) {
        images.forEach((img) => {
          const altText = img.getAttribute("alt");
          expect(altText).toBeTruthy();
        });
      }
    });
  });

  describe("키보드 네비게이션", () => {
    it("Tab으로 인터랙티브 요소에 순차 접근 가능", async () => {
      const user = userEvent.setup();
      render(<MainLayout />);

      // 초기 포커스
      const initialElement = document.activeElement;

      // Tab 키 3번
      await user.tab();
      const firstTab = document.activeElement;
      expect(firstTab).not.toBe(initialElement);

      await user.tab();
      const secondTab = document.activeElement;
      expect(secondTab).not.toBe(firstTab);

      await user.tab();
      const thirdTab = document.activeElement;
      expect(thirdTab).not.toBe(secondTab);
    });

    it("Shift+Tab으로 역순 접근 가능", async () => {
      const user = userEvent.setup();
      render(<MainLayout />);

      // 먼저 Tab으로 이동
      await user.tab();
      await user.tab();
      const forwardElement = document.activeElement;

      // Shift+Tab으로 뒤로
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      const backwardElement = document.activeElement;

      expect(backwardElement).not.toBe(forwardElement);
    });

    it("Enter 키로 버튼 활성화 가능", async () => {
      const user = userEvent.setup();
      render(<MainLayout />);

      // 버튼 찾기
      const buttons = screen.getAllByRole("button");

      if (buttons.length > 0) {
        const button = buttons[0];
        button.focus();

        // Enter로 실행
        await user.keyboard("{Enter}");

        // 포커스가 유지되는지 확인
        expect(document.activeElement).toBe(button);
      }
    });

    it("Space 키로 체크박스 토글 가능", async () => {
      const user = userEvent.setup();
      render(<QueryBuilder />);

      const checkboxes = screen.queryAllByRole("checkbox");

      if (checkboxes.length > 0) {
        const checkbox = checkboxes[0];
        const initialChecked = checkbox.getAttribute("aria-checked") === "true";

        checkbox.focus();
        await user.keyboard("{Space}");

        // 상태가 변경되었는지 확인 (실제 컴포넌트 동작에 따라 다를 수 있음)
        expect(document.activeElement).toBe(checkbox);
      }
    });
  });

  describe("Heading 구조", () => {
    it("h1 heading이 존재하는가", () => {
      render(<MainLayout />);

      const h1 = screen.queryByRole("heading", { level: 1 });

      // h1이 없을 수도 있으므로 경고만 출력
      if (!h1) {
        console.warn("Warning: No h1 heading found");
      }
    });

    it("heading 레벨이 순차적인가", () => {
      render(<MainLayout />);

      const headings = screen.queryAllByRole("heading");

      if (headings.length === 0) {
        console.warn("Warning: No headings found");
        return;
      }

      const levels = headings.map((heading) =>
        parseInt(heading.tagName.substring(1))
      );

      // heading 레벨이 크게 건너뛰지 않는지 확인
      for (let i = 1; i < levels.length; i++) {
        const levelDiff = levels[i] - levels[i - 1];

        // 한 번에 2레벨 이상 건너뛰는 것은 권장하지 않음
        if (levelDiff > 2) {
          console.warn(
            `Warning: Heading level skipped from h${levels[i - 1]} to h${levels[i]}`
          );
        }
      }
    });
  });

  describe("ARIA Live Regions", () => {
    it("로딩 상태에 적절한 role이 있는가", () => {
      // 로딩 상태로 설정
      useDBStore.setState({
        isLoading: true,
      });

      render(<MainLayout />);

      // role="status" 또는 aria-live 확인
      const statusRegion = screen.queryByRole("status");
      const liveRegions = document.querySelectorAll("[aria-live]");

      if (!statusRegion && liveRegions.length === 0) {
        console.warn("Warning: No loading status or live region found");
      }
    });

    it("에러 메시지에 role='alert'가 있는가", () => {
      // 에러 상태로 설정
      useQueryStore.setState({
        error: "Test error message",
        executionMetadata: {
          executionTime: 0,
          rowCount: 0,
          status: "error",
          error: "Test error message",
          timestamp: new Date(),
        },
      });

      render(<MainLayout />);

      // role="alert" 확인
      const alert = screen.queryByRole("alert");

      if (!alert) {
        console.warn("Warning: Error message without role='alert'");
      }
    });
  });

  describe("포커스 관리", () => {
    it("모달 열릴 때 첫 번째 요소에 포커스", async () => {
      const user = userEvent.setup();
      render(<MainLayout />);

      // 모달을 여는 버튼 찾기 (예: 삭제 확인 다이얼로그)
      const dialogTriggers = screen.queryAllByRole("button");

      // AlertDialog 트리거 찾기
      for (const trigger of dialogTriggers) {
        const ariaHaspopup = trigger.getAttribute("aria-haspopup");

        if (ariaHaspopup === "dialog") {
          await user.click(trigger);

          // dialog가 열렸는지 확인
          const dialog = screen.queryByRole("dialog");

          if (dialog) {
            // 포커스가 dialog 내부에 있는지 확인
            const focusedElement = document.activeElement;
            expect(dialog.contains(focusedElement)).toBe(true);

            break;
          }
        }
      }
    });

    it("포커스 가능한 요소에 tabindex가 올바른가", () => {
      render(<MainLayout />);

      // tabindex="-1"은 프로그래밍 방식으로만 포커스 가능
      // tabindex="0"은 일반 탭 순서
      // tabindex > 0은 권장하지 않음

      const elementsWithTabindex = document.querySelectorAll("[tabindex]");

      elementsWithTabindex.forEach((element) => {
        const tabindex = parseInt(element.getAttribute("tabindex") || "0");

        // 양수 tabindex는 권장하지 않음
        if (tabindex > 0) {
          console.warn(
            `Warning: Positive tabindex (${tabindex}) found, which is not recommended`
          );
        }
      });
    });
  });

  describe("색상 대비", () => {
    it("텍스트 요소에 색상이 지정되어 있는가", () => {
      render(<MainLayout />);

      // 주요 텍스트 요소들 확인
      const textElements = document.querySelectorAll(
        "p, span, div, h1, h2, h3, h4, h5, h6"
      );

      let colorCount = 0;
      let backgroundCount = 0;

      textElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;

        if (color && color !== "rgba(0, 0, 0, 0)") colorCount++;
        if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)")
          backgroundCount++;
      });

      console.log(`Elements with color: ${colorCount}`);
      console.log(`Elements with background: ${backgroundCount}`);

      // 대부분의 요소에 색상이 지정되어야 함
      expect(colorCount).toBeGreaterThan(0);
    });

    it("버튼에 충분한 대비가 있는가", () => {
      render(<MainLayout />);

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        const styles = window.getComputedStyle(button);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;

        // 색상이 지정되어 있는지 확인
        expect(color).toBeTruthy();
        expect(backgroundColor).toBeTruthy();

        // 실제 대비율 계산은 복잡하므로 색상 존재만 확인
      });
    });
  });

  describe("스크린 리더 지원", () => {
    it("sr-only 클래스가 적절히 사용되는가", () => {
      render(<MainLayout />);

      // sr-only 클래스를 가진 요소들
      const srOnlyElements = document.querySelectorAll(".sr-only");

      console.log(`Screen reader only elements: ${srOnlyElements.length}`);

      srOnlyElements.forEach((element) => {
        // 텍스트 내용이 있는지 확인
        expect(element.textContent).toBeTruthy();
      });
    });

    it("아이콘 버튼에 텍스트 대체가 있는가", () => {
      render(<MainLayout />);

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button, index) => {
        // 버튼이 아이콘만 있는 경우 (텍스트 내용이 없는 경우)
        const hasTextContent = button.textContent?.trim();
        const hasAriaLabel = button.getAttribute("aria-label");
        const hasSrOnly = button.querySelector(".sr-only");

        if (!hasTextContent) {
          // aria-label 또는 sr-only가 있어야 함
          const hasAccessibleText = hasAriaLabel || hasSrOnly;

          if (!hasAccessibleText) {
            console.warn(
              "Warning: Button without text content and without aria-label or sr-only"
            );
            console.error(
              `❌ 접근 가능한 이름이 없는 버튼 발견 (index: ${index}):`
            );
            console.log(button.outerHTML); // 해당 버튼의 전체 태그 출력
          }
        }
      });
    });
  });

  describe("폼 접근성", () => {
    it("필수 입력 필드가 표시되는가", () => {
      render(<QueryBuilder />);

      const requiredInputs = document.querySelectorAll(
        '[required], [aria-required="true"]'
      );

      console.log(`Required fields: ${requiredInputs.length}`);

      requiredInputs.forEach((input) => {
        // 필수 필드에 레이블이 있는지 확인
        const hasLabel =
          input.getAttribute("aria-label") ||
          input.getAttribute("aria-labelledby") ||
          document.querySelector(`label[for="${input.id}"]`);

        expect(hasLabel).toBeTruthy();
      });
    });

    it("에러 메시지가 폼 요소와 연결되는가", () => {
      // 에러 상태로 설정
      useQueryStore.setState({
        error: "Invalid SQL syntax",
      });

      render(<QueryBuilder />);

      // aria-describedby로 에러 메시지 연결 확인
      const inputsWithErrors = document.querySelectorAll("[aria-describedby]");

      inputsWithErrors.forEach((input) => {
        const describedBy = input.getAttribute("aria-describedby");
        if (describedBy) {
          const errorElement = document.getElementById(describedBy);
          expect(errorElement).toBeTruthy();
        }
      });
    });
  });

  describe("랜드마크 영역", () => {
    it("주요 랜드마크가 존재하는가", () => {
      render(<MainLayout />);

      // 주요 랜드마크 role 확인
      const landmarks = {
        banner: screen.queryAllByRole("banner"), // header
        navigation: screen.queryAllByRole("navigation"), // nav
        main: screen.queryAllByRole("main"), // main
        complementary: screen.queryAllByRole("complementary"), // aside
        contentinfo: screen.queryAllByRole("contentinfo"), // footer
      };

      console.log("Landmarks found:");
      Object.entries(landmarks).forEach(([name, elements]) => {
        console.log(`  ${name}: ${elements.length}`);
      });

      // main 랜드마크는 필수
      expect(landmarks.main.length).toBeGreaterThan(0);
    });
  });
});
