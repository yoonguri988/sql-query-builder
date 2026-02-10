"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainContentProps } from "@/types/layout";
import QueryBuilder from "@/components/query-builder/QueryBuilder";
import SQLEditor from "@/components/sql-editor/SQLEditor";
import ResultsTable from "@/components/results/ResultsTable";
import LoadingResults from "@/components/results/LoadingResults";
import ErrorResults from "@/components/results/ErrorResults";
import EmptyResults from "@/components/results/EmptyResults";
import VisualizationTab from "@/components/visualization/VisualizationTab";
import { memo, useEffect, useState } from "react";
import { useQueryStore } from "@/store/query-store";

function MainContent({ isRightPanelOpen }: MainContentProps) {
  const [activeTab, setActiveTab] = useState<string>("builder");

  const queryResult = useQueryStore((state) => state.queryResult);
  const isExecuting = useQueryStore((state) => state.isExecuting);
  const error = useQueryStore((state) => state.error);

  // 쿼리 결과가 생성되면 자동으로 Results 탭으로 전환
  useEffect(() => {
    if (queryResult !== null) {
      setActiveTab("results");
    }
  }, [queryResult]);

  return (
    <main
      className={`
        flex-1 overflow-auto
        ${isRightPanelOpen ? "hidden md:block" : "block"}
      `}
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
          <TabsTrigger
            value="builder"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            📊 Query Builder
          </TabsTrigger>
          <TabsTrigger
            value="sqlEditor"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            📝 SQL Editor
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            📋 Results
            {queryResult && queryResult.rowCount > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({queryResult.rowCount})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="visualization"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            📈 Visualization
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 p-6">
          {/* Query Builder 탭 */}
          <TabsContent value="builder" className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-muted-foreground">
                <QueryBuilder />
              </div>
            </div>
          </TabsContent>

          {/* SQL Editor 탭 */}
          <TabsContent value="sqlEditor" className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold">SQL Editor</h2>
              <div className="text-muted-foreground">
                <SQLEditor />
              </div>
            </div>
          </TabsContent>

          {/* Results 탭 */}
          <TabsContent value="results" className="p-4 md:p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Query Results</h2>

              {/* 로딩 상태 */}
              {isExecuting && <LoadingResults />}

              {/* 에러 상태 */}
              {!isExecuting && error && <ErrorResults error={error} />}

              {/* 빈 결과 (아직 실행 안 함) */}
              {!isExecuting && !error && !queryResult && (
                <EmptyResults message="쿼리를 실행하여 결과를 확인하세요." />
              )}

              {/* 빈 결과 (실행 성공했지만 데이터 없음) */}
              {!isExecuting &&
                !error &&
                queryResult &&
                queryResult.rowCount === 0 && (
                  <EmptyResults message="쿼리가 성공적으로 실행되었지만 결과가 없습니다." />
                )}

              {/* 결과 테이블 */}
              {!isExecuting &&
                !error &&
                queryResult &&
                queryResult.rowCount > 0 && (
                  <ResultsTable data={queryResult.data} />
                )}
            </div>
          </TabsContent>

          {/* Visualization 탭 */}
          <TabsContent value="visualization" className="p-4 md:p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Data Visualization</h2>
              <div className="text-muted-foreground">
                <VisualizationTab />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
export default memo(MainContent);
