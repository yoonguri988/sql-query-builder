"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightPanel from "@/components/layout/RightPanel";
import MainContent from "@/components/layout/MainContent";

export default function MainLayout() {
  const [isDark, setIsDark] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // 다크모드 토글
  const handleThemeToggle = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 초기 테마 설정 (로컬스토리지 또는 시스템 설정)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // 테마 변경 시 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
        onThemeToggle={handleThemeToggle}
        isDark={isDark}
        onLeftSidebarToggle={() => setShowLeftSidebar(!showLeftSidebar)}
        onRightPanelToggle={() => setShowRightPanel(!showRightPanel)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar
          isOpen={showLeftSidebar}
          onClose={() => setShowLeftSidebar(false)}
        />

        {/* Left Sidebar Overlay (모바일/태블릿) */}
        {showLeftSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setShowLeftSidebar(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <MainContent isRightPanelOpen={showRightPanel} />

        {/* Right Panel */}
        <RightPanel
          isOpen={showRightPanel}
          isDark={isDark}
          onClose={() => setShowRightPanel(false)}
        />

        {/* Right Panel Overlay (모바일/태블릿) */}
        {showRightPanel && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setShowRightPanel(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
