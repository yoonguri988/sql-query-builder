"use client";

import { X } from "lucide-react";
import { RightPanelProps } from "@/types/layout";
import { Button } from "../ui/button";
import { SQLPreview } from "../sql-preview/SQLPreview";

/**
 * 오른쪽 패널 컴포넌트
 * - SQL 프리뷰 탭
 * - 실행 정보 탭
 */

export default function RightPanel({
  isOpen,
  isDark,
  onClose,
}: RightPanelProps) {
  return (
    <aside
      className={`
        ${isOpen ? "block" : "hidden"}
        md:${isOpen ? "block" : "hidden"}
        lg:block
        fixed lg:static inset-y-0 right-0 z-40
        w-full md:w-96 lg:w-[500px]
        bg-muted/90 border-l
        overflow-y-auto
        flex flex-col
      `}
    >
      {/* 모바일/태블릿 헤더 */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b bg-background">
        <h3 className="font-semibold">Results Panel</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 패널 컨텐츠 */}
      <div className="p-4 space-y-4">
        {/* SQL 프리뷰 섹션 */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span>🔍</span>
            <span className="hidden lg:inline">SQL Preview</span>
            <span className="lg:hidden">SQL</span>
          </h3>
          <SQLPreview isDark={isDark} />
        </div>

        {/* 실행 정보 섹션*/}
        <div>
          <h3 className="font-semibold mb-2">ℹ️ Execution Info</h3>
          <div className="bg-background border rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rows:</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Execution Time:</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-semibold text-muted-foreground">Ready</span>
            </div>
            <p className="text-xs text-muted-foreground italic mt-2">
              SQL을 실행하면 정보가 표시됩니다 (18일차 구현 예정)
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
