"use client";

import { X } from "lucide-react";
import { RightPanelProps } from "@/types/layout";
import { Button } from "../ui/button";
import SQLPreview from "@/components/sql-preview/SQLPreview";

export default function RightPanel({
  isOpen,
  onClose,
  isDark,
}: RightPanelProps) {
  return (
    <aside
      className={`
        ${isOpen ? "block" : "hidden"}
        md:${isOpen ? "block" : "hidden"}
        lg:block
        fixed lg:static inset-y-0 right-0 z-40
        w-full md:w-96 lg:w-[500px]
        bg-background border-l
        flex flex-col
        overflow-hidden
      `}
    >
      {/* 모바일/태블릿 헤더 */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b bg-background shrink-0">
        <h3 className="font-semibold">Results Panel</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 🆕 스크롤 가능한 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* SQL 프리뷰 섹션 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="h-4 w-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
              />
            </svg>
            <h3 className="text-sm font-semibold">SQL Preview</h3>
          </div>

          <SQLPreview isDark={isDark} />
        </section>

        {/* 실행 정보 섹션 (19일차 구현 예정) */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="h-4 w-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-sm font-semibold">Execution Info</h3>
          </div>

          <div className="bg-muted/30 border rounded-lg p-4 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rows:</span>
              <span className="font-medium">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Execution Time:</span>
              <span className="font-medium">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-muted-foreground">Ready</span>
            </div>
            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground italic">
                SQL을 실행하면 정보가 표시됩니다 (19일차 구현 예정)
              </p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
