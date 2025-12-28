"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainContentProps } from "@/types/layout";

export default function MainContent({ isRightPanelOpen }: MainContentProps) {
  return (
    <main
      className={`
        flex-1 overflow-auto
        ${isRightPanelOpen ? "hidden md:block" : "block"}
      `}
    >
      {" "}
      <Tabs defaultValue="builder" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
          <TabsTrigger
            value="query-builder"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            📊 Query Builder
          </TabsTrigger>
          <TabsTrigger
            value="sql-editor"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            📝 SQL Editor
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            📋 Results
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
          <TabsContent value="query-builder" className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold">Query Builder</h2>
              {/* Query Builder 폼 내용 */}
              <div className="text-muted-foreground">
                Query Builder 컴포넌트가 여기에 렌더링됩니다.
              </div>
            </div>
          </TabsContent>

          {/* SQL Editor 탭 */}
          <TabsContent value="sql-editor" className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold">SQL Editor</h2>
              <div className="text-muted-foreground">
                SQL Editor가 여기에 렌더링됩니다.
              </div>
            </div>
          </TabsContent>

          {/* Results 탭 */}
          <TabsContent value="results" className="p-4 md:p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Query Results</h2>
              <div className="text-muted-foreground">
                Results 테이블이 여기에 렌더링됩니다.
              </div>
            </div>
          </TabsContent>

          {/* Visualization 탭 */}
          <TabsContent value="visualization" className="p-4 md:p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Data Visualization</h2>
              <div className="text-muted-foreground">
                차트가 여기에 렌더링됩니다.
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
