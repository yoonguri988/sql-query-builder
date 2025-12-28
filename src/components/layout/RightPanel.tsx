"use client";

import { X } from "lucide-react";
import { RightPanelProps } from "@/types/layout";
import { Button } from "../ui/button";

export default function RightPanel({ isOpen, onClose }: RightPanelProps) {
  return (
    <aside
      className={`
        ${isOpen ? "block" : "hidden"}
        md:${isOpen ? "block" : "hidden"}
        lg:block
        fixed lg:static inset-y-0 right-0 z-40
        w-full md:w-96 lg:w-[500px]
        bg-muted/30 border-l
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
          <div className="bg-background border rounded-lg p-3 font-mono text-sm overflow-x-auto">
            <pre className="text-xs md:text-sm">
              SELECT id, name, email{"\n"}
              FROM users{"\n"}
              WHERE created_at &gt; {"'"}2023-01-01{"'"}
              {"\n"}
              ORDER BY created_at DESC{"\n"}
              LIMIT 100
            </pre>
          </div>
        </div>

        {/* 실행 정보 섹션 */}
        <div>
          <h3 className="font-semibold mb-2">ℹ️ Execution Info</h3>
          <div className="bg-background border rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rows:</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Execution Time:</span>
              <span className="font-semibold">12ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-semibold text-green-600">Success</span>
            </div>
          </div>
        </div>

        {/* 에러 메시지 섹션 (조건부) */}
        <div className="hidden">
          <h3 className="font-semibold mb-2 text-red-600">⚠️ Error</h3>
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm">
            <p className="text-red-900 dark:text-red-100">
              Syntax error near {"'"}FROM{"'"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
