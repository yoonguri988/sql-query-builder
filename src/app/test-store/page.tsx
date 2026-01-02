"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQueryStore } from "@/store/query-store";
import { useDBStore } from "@/store/db-store";
import { useHistoryStore } from "@/store/history-store";

export default function TestStorePage() {
  const {
    setSelectedTable,
    toggleColumn,
    addWhereCondition,
    setLimit,
    generatedSQL,
  } = useQueryStore();

  const { initialize, isInitialized, isLoading } = useDBStore();
  const { addToHistory, history } = useHistoryStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleTestQuery = () => {
    setSelectedTable("users");
    toggleColumn("id");
    toggleColumn("name");
    toggleColumn("email");
    addWhereCondition({
      id: `condition-${Date.now()}`,
      column: "country",
      operator: "=",
      value: "USA",
      logicalOperator: "AND",
    });
    setLimit(10);

    // 히스토리에 추가
    addToHistory({
      sql: generatedSQL,
      timestamp: new Date(),
      executionTime: 12,
      rowCount: 10,
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Zustand Store Test</h1>

      <div>
        <p>DB Initialized: {isInitialized ? "✅ Yes" : "❌ No"}</p>
        <p>Loading: {isLoading ? "⏳ Yes" : "No"}</p>
      </div>

      <Button onClick={handleTestQuery}>Generate Test Query</Button>

      {generatedSQL && (
        <div>
          <p className="font-semibold">Generated SQL:</p>
          <pre className="bg-muted p-4 rounded text-sm">{generatedSQL}</pre>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <p className="font-semibold">Query History ({history.length}):</p>
          <ul className="list-disc list-inside">
            {history.map((item) => (
              <li key={item.id} className="text-sm">
                {item.sql.substring(0, 50)}...
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
