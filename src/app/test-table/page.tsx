// src/app/test-table/page.tsx
"use client";

import { useEffect } from "react";
import { ResultsTable } from "@/components/results/ResultsTable";
import { useQueryStore } from "@/store/query-store";
import { Button } from "@/components/ui/button";
import WhereClauseBuilder from "@/components/query-builder/WhereClauseBuilder";

/**
 * ResultsTable 컴포넌트를 테스트하기 위한 페이지
 */
export default function TestTablePage() {
  const setQueryResult = useQueryStore((state) => state.queryResult);
  const executeQuery = useQueryStore((state) => state.executeQuery);
  const setSelectedTable = useQueryStore((state) => state.setSelectedTable);
  const setSelectedColumns = useQueryStore((state) => state.setSelectedColumns);
  const addWhereCondition = useQueryStore((state) => state.addWhereCondition);
  const generateSQL = useQueryStore((state) => state.generateSQL);
  const generatedSQL = useQueryStore((state) => state.generatedSQL);
  const queryResult = useQueryStore((state) => state.queryResult);
  const executionTime = useQueryStore((state) => state.executionTime);

  // 샘플 데이터로 결과 설정
  const loadSampleData = () => {
    setSelectedTable("products");
    executeQuery();
  };

  // 빈 결과로 설정
  const loadEmptyData = () => {
    setSelectedTable("products");
    addWhereCondition({
      id: "cond-1",
      column: "price",
      operator: "<",
      value: 100,
    });
    addWhereCondition({
      id: "cond-2",
      column: "stock",
      operator: "=",
      value: 0,
      logicalOperator: "AND",
    });
    executeQuery();
  };

  // 실제 쿼리 실행 (DB가 초기화되어 있어야 함)
  const runRealQuery = async () => {
    setSelectedTable("users");
    setSelectedColumns(["id", "name", "email", "country"]);
    generateSQL();
    await executeQuery();
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Results Table Test</h1>

      <div className="flex gap-4 mb-6">
        <Button onClick={loadSampleData} variant="outline">
          Load Sample Data
        </Button>
        <Button onClick={loadEmptyData} variant="outline">
          Load Empty Data
        </Button>
        <Button onClick={runRealQuery} variant="default">
          Run Real Query (Users Table)
        </Button>
      </div>

      {generatedSQL && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Generated SQL:</h3>
          <pre className="text-sm">{generatedSQL}</pre>
        </div>
      )}

      {queryResult && executionTime !== null && (
        <div className="mb-4 text-sm text-gray-600">
          Execution time: {executionTime}ms | Rows: {queryResult.rowCount}
        </div>
      )}

      <ResultsTable />
    </div>
  );
}
