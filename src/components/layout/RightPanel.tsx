"use client";

import { Code, X } from "lucide-react";
import { RightPanelProps } from "@/types/layout";
import SQLPreview from "@/components/sql-preview/SQLPreview";
import { Button } from "@/components/ui/button";
import { memo } from "react";

function RightPanel({ isOpen, onClose }: RightPanelProps) {
  return (
    <aside
      className={`
        ${isOpen ? "block" : "hidden"}
        md:${isOpen ? "block" : "hidden"}
        lg:block
        fixed lg:static inset-y-0 right-0 z-40
        w-full md:w-72 lg:w-[300px] xl:w-[400px]
        bg-background border-l
        flex flex-col
        overflow-hidden
      `}
    >
      {/* 모바일/태블릿 헤더 */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b bg-background shrink-0">
        <h3 className="font-semibold">Results Panel</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="rightExit"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 데스크톱 헤더 */}
      <div className="hidden lg:block m-4 mb-0">
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full">
          <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow gap-2 bg-background text-foreground shadow w-full">
            <Code className="h-4 w-4" />
            SQL Preview
          </div>
        </div>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <SQLPreview />
      </div>
    </aside>
  );
}

export default memo(RightPanel);
