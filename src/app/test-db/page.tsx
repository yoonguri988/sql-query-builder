"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { initDatabase } from "@/lib/db/init-db";

export default function TestDBPage() {
  const [status, setStatus] = useState<string>("Not initialized");
  const [stats, setStats] = useState<Record<string, number>>({});

  const handleInit = async () => {
    try {
      setStatus("Initializing...");
      const db = await initDatabase(true);
      // true: 샘플 데이터

      // 각 테이블의 레코드 수 확인
      const tables = [
        "users",
        "products",
        "categories",
        "orders",
        "order_items",
      ];
      const counts: Record<string, number> = {};

      for (const table of tables) {
        const result = db.exec(`SELECT COUNT(*) as count FROM ${table}`);
        counts[table] = result[0].values[0][0] as number;
      }

      setStats(counts);
      setStatus("Success!! Database initialized with sample data.");
    } catch (error) {
      setStatus(`~Error: ${error}`);
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
      {Object.keys(stats).length > 0 && (
        <div>
          <p className="font-semibold mb-2">Record Counts:</p>
          <table className="border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Table</th>
                <th className="border border-gray-300 px-4 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats).map(([table, count]) => (
                <tr key={table}>
                  <td className="border border-gray-300 px-4 py-2">{table}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
