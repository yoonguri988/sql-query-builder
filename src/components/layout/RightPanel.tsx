"use client";

import { useState } from "react";
import { Code, Database, X } from "lucide-react";
import { RightPanelProps } from "@/types/layout";
import SQLPreview from "@/components/sql-preview/SQLPreview";
import ExecutionInfo from "@/components/sql-preview/ExecutionInfo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DownloadButton from "@/components/results/DownloadButton";
import ResultsTable from "@/components/results/ResultsTable";
import LoadingResults from "@/components/results/LoadingResults";
import ErrorResults from "@/components/results/ErrorResults";
import EmptyResults from "@/components/results/EmptyResults";
import { useQueryStore } from "@/store/query-store";

export default function RightPanel({
  isOpen,
  onClose,
  isDark,
}: RightPanelProps) {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<"sql" | "results">("sql");

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

  // Results 탭 활성화 핸들러
  const handleExecute = () => {
    setActiveTab("results");
  };

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
      <div className="flex-1 custom-scrollbar">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "sql" | "results")}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
            <TabsTrigger value="sql" className="gap-2">
              <Code className="h-4 w-4" />
              SQL Preview
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <Database className="h-4 w-4" />
              Results
              {queryResults && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({queryResults.data.rowCount})
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* SQL Preview 탭 */}
          <TabsContent value="sql" className="flex-1 overflow-auto p-4 m-0">
            <SQLPreview isDark={isDark} onExecute={handleExecute} />
          </TabsContent>

          {/* Results 탭 */}
          <TabsContent value="results" className="flex-1 overflow-auto p-4 m-0">
            {/* 로딩 상태 */}
            {isExecuting && <LoadingResults />}

            {/* 에러 상태 */}
            {!isExecuting && queryResults?.metadata.status === "error" && (
              <div className="space-y-4">
                <ExecutionInfo metadata={queryResults.metadata} />
                <ErrorResults
                  error={queryResults.metadata.error || "Unknown error"}
                />
              </div>
            )}

            {/* 빈 결과 (아직 실행 안 함) */}
            {!isExecuting && !queryResults && (
              <EmptyResults message="쿼리를 실행하여 결과를 확인하세요." />
            )}

            {/* 빈 결과 (실행 성공했지만 데이터 없음) */}
            {!isExecuting &&
              queryResults?.metadata.status === "success" &&
              queryResults.data.rowCount === 0 && (
                <div className="space-y-4">
                  <ExecutionInfo metadata={queryResults.metadata} />
                  <EmptyResults message="쿼리가 성공적으로 실행되었지만 결과가 없습니다." />
                </div>
              )}

            {/* 결과 테이블 */}
            {!isExecuting &&
              queryResults?.metadata.status === "success" &&
              queryResults.data.rowCount > 0 && (
                <div className="space-y-4">
                  {/* 실행 정보 및 다운로드 버튼 */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <ExecutionInfo metadata={queryResults.metadata} />
                    </div>
                    <DownloadButton data={queryResults.data.data} />
                  </div>

                  {/* 결과 테이블 */}
                  <ResultsTable data={queryResults.data.data} />
                </div>
              )}
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
