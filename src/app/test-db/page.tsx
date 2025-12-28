"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { initDatabase } from "@/lib/db/init-db";

export default function TestDBPage() {
  const [status, setStatus] = useState<string>("Not initialized");
  const [tables, setTables] = useState<string[]>([]);

  const handleInit = async () => {
    try {
      setStatus("Initializing...");
      const db = await initDatabase();

      // 테이블 목록 조회
      const result = db.exec(`
        SELECT name FROM sqlite_master 
        WHERE type='table' 
        ORDER BY name;
      `);

      if (result.length > 0) {
        const tableNames = result[0].values.map((row) => row[0] as string);
        setTables(tableNames);
        setStatus("✅ Success! Tables created.");
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Initialization Test</h1>

      <Button onClick={handleInit} className="mb-4">
        Initialize Database
      </Button>

      <div className="mb-4">
        <p className="font-semibold">Status:</p>
        <p>{status}</p>
      </div>

      {tables.length > 0 && (
        <div>
          <p className="font-semibold">Tables ({tables.length}):</p>
          <ul className="list-disc list-inside">
            {tables.map((table) => (
              <li key={table}>{table}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
