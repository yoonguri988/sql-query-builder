"use client";

import { HeaderProps } from "@/types/layout";
import { Button } from "../ui/button";
import { Github, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header({
  onLeftSidebarToggle,
  onRightPanelToggle,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
      {/* 왼쪽: 모바일 햄버거 메뉴 + 로고 */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onLeftSidebarToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">SQL</span>
        </div>
        <h1 className="text-xl font-bold">Query Builder</h1>
      </div>

      {/* 오른쪽: 결과 패널 + 다크 모드 + GitHub */}
      <div className="flex items-center gap-2">
        {/* 모바일/태블릿 결과 패널 토글 */}
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={onRightPanelToggle}
        >
          <span className="hidden sm:inline">Results</span>
          <span className="sm:hidden">📊</span>
        </Button>
        <ThemeToggle />

        {/* GitHub 링크 */}
        <Button variant="ghost" size="icon" asChild>
          <a
            href="https://github.com/yoonguri988/sql-query-builder"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <Github className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </header>
  );
}
