"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightPanel from "@/components/layout/RightPanel";
import MainContent from "@/components/layout/MainContent";

export default function MainLayout() {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
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
