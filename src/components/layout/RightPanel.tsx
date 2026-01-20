"use client";

import { Code, Database, X } from "lucide-react";
import { RightPanelProps } from "@/types/layout";
import SQLPreview from "@/components/sql-preview/SQLPreview";
import ExecutionInfo from "@/components/sql-preview/ExecutionInfo";
// import { useDBStore } from "@/store/db-store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadButton } from "@/components/results/DownloadButton";
import { useQueryStore } from "@/store/query-store";

export default function RightPanel({
  isOpen,
  onClose,
  isDark,
}: RightPanelProps) {
  // query-store에서 가져오기
  const queryResult = useQueryStore((state) => state.queryResult);
  const executionMetadata = useQueryStore((state) => state.executionMetadata);
  const isExecuting = useQueryStore((state) => state.isExecuting);

  // ExecutionResult 형태로 재구성
  const queryResults =
    queryResult && executionMetadata
      ? {
          data: queryResult,
          metadata: executionMetadata,
        }
      : null;
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

      {/* 스크롤 가능한 컨텐츠 영역 */}
      {/* <div className="flex-1 overflow-y-auto custom-scrollbar"> */}
      <div className="flex-1 custom-scrollbar">
        <Tabs defaultValue="sql" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
            <TabsTrigger value="sql" className="gap-2">
              <Code className="h-4 w-4" />
              SQL Preview
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <Database className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* SQL Preview 탭 */}
          <TabsContent value="sql" className="flex-1 overflow-auto p-4 m-0">
            <SQLPreview isDark={isDark} />
          </TabsContent>

          {/* Results 탭 */}
          <TabsContent value="results" className="flex-1 overflow-auto p-4 m-0">
            {isExecuting ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Executing query...</p>
                </div>
              </div>
            ) : queryResults ? (
              <div className="space-y-4">
                {/* Execution Info */}
                <ExecutionInfo metadata={queryResults.metadata} />

                {/* Download Button */}
                {queryResults.metadata.status === "success" && (
                  <div className="flex justify-end">
                    <DownloadButton data={queryResults.data.data} />
                  </div>
                )}

                {/* Results Table Placeholder */}
                {queryResults.metadata.status === "success" && (
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      결과 출력 기능은 다음 업데이트 시 도입될 예정입니다.
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      {queryResults.data.data.length} rows loaded
                    </p>
                  </div>
                )}

                {/* Error State */}
                {queryResults.metadata.status === "error" && (
                  <div className="border border-destructive rounded-md p-4">
                    <p className="text-sm text-destructive font-medium">
                      Query Error
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {queryResults.metadata.error || "Unknown error occurred"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    아직 쿼리 결과가 없습니다.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    쿼리를 실행하여 결과를 확인하세요.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
