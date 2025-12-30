"use client";

import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { LeftSidebarProps } from "@/types/layout";
import DBSchemaTree from "./DBSchemaTree";
import QueryHistory from "./QueryHistory";
import { Button } from "../ui/button";
import { useDBStore } from "@/store/db-store";

export default function LeftSidebar({
  isOpen = true,
  onClose,
}: LeftSidebarProps) {
  const { initialize, isInitialized, isLoading, error } = useDBStore();

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initialize();
    }
  }, [initialize, isInitialized, isLoading]);

  if (isLoading) {
    return (
      <aside className="w-[250px] border-r border-border bg-background p-4">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-[250px] border-r border-border bg-background p-4">
        <div className="text-sm text-destructive">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 lg:w-64
        bg-background border-r
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        overflow-y-auto
        flex flex-col
      `}
    >
      {/* 모바일 헤더 */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b">
        <h2 className="font-semibold">Menu</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 데이터베이스 스키마 섹션 */}
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Accordion을 사용한 DB 스키마 트리 뷰 */}
        <DBSchemaTree />

        {/* 쿼리 히스토리 섹션 */}
        <div className="mt-6">
          <QueryHistory />
        </div>
      </div>
    </aside>
  );
}
