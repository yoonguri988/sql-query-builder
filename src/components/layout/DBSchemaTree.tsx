import { useDBStore } from "@/store/db-store";
import { useQueryStore } from "@/store/query-store";

import { Accordion } from "@/components/ui/accordion";
import { Database } from "lucide-react";
import DBSchemaTableItem from "./DBSchemaTableItem";
import { memo } from "react";

function DBSchemaTree() {
  const tables = useDBStore((state) => state.tables);
  const setSelectedTable = useQueryStore((state) => state.setSelectedTable);

  const handleTableClick = (name: string) => {
    setSelectedTable(name);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Database className="h-4 w-4" />
        <h3 className="font-semibold">Database Schema</h3>
      </div>
      {/* type="single" 한번의 하나의 테이블만 열 수 있음, multiple은 여러개 열 수 있음. */}
      <Accordion type="single" collapsible className="w-full">
        {tables.map((table) => (
          <DBSchemaTableItem
            key={table.name}
            table={table}
            columns={table.columns}
            onClick={handleTableClick}
          />
        ))}
      </Accordion>
    </div>
  );
}

export default memo(DBSchemaTree);
