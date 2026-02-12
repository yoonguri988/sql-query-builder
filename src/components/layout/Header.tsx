"use client";

import { HeaderProps } from "@/types/layout";
import { Button } from "../ui/button";
import { ClipboardList, Github, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { memo } from "react";

function Header({ onLeftSidebarToggle, onRightPanelToggle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
      {/* 왼쪽: 모바일 햄버거 메뉴 + 로고 */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="xl:hidden h-8 w-8 sm:h-10 sm:w-10"
          onClick={onLeftSidebarToggle}
          aria-label="menu"
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <div className="rounded flex items-center justify-center">
          <div className="text-sm sm:text-base md:text-lg font-bold truncate max-w-[150px] sm:max-w-none">
            SQL Query Builder
          </div>
        </div>
      </div>

      {/* 오른쪽: 결과 패널 + 다크 모드 + GitHub */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* 모바일/태블릿 결과 패널 토글 */}
        <Button
          variant="outline"
          size="sm"
          className="xl:hidden text-xs sm:text-sm px-2 sm:px-4"
          onClick={onRightPanelToggle}
        >
          <span className="hidden sm:inline">Preview</span>
          <span className="sm:hidden">
            <ClipboardList className="w-4 h-4" />
          </span>
        </Button>
        <ThemeToggle />

        {/* GitHub 링크 */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10"
          asChild
        >
          <a
            href="https://github.com/yoonguri988/sql-query-builder"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <Github className="h-4 w-4 sm:h-5 sm:w-5" />
          </a>
        </Button>
      </div>
    </header>
  );
}

export default memo(Header);
