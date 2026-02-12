"use client";

import { useCallback, useState } from "react";
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightPanel from "@/components/layout/RightPanel";
import MainContent from "@/components/layout/MainContent";

export default function MainLayout() {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // useCallback으로 함수 메모이제이션
  const handleLeftSidebarToggle = useCallback(() => {
    setShowLeftSidebar((prev) => !prev);
  }, []);

  const handleRightPanelToggle = useCallback(() => {
    setShowRightPanel((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
        onLeftSidebarToggle={handleLeftSidebarToggle}
        onRightPanelToggle={handleRightPanelToggle}
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
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
            onClick={() => setShowLeftSidebar(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <MainContent isRightPanelOpen={showRightPanel} />

        {/* Right Panel */}
        <RightPanel
          isOpen={showRightPanel}
          onClose={() => setShowRightPanel(false)}
        />
      </div>
    </div>
  );
}
