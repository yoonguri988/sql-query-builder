import { useDBStore } from "@/store/db-store";
import { useQueryStore } from "@/store/query-store";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Database, Table, Columns } from "lucide-react";

export default function DBSchemaTree() {
  const { tables } = useDBStore();
  const { setSelectedTable, toggleColumn, selectedColumns } = useQueryStore();

  const handleTableClick = (tblNm: string) => {
    setSelectedTable(tblNm);
  };

  const handleColumnDoubleClick = (colNm: string) => {
    toggleColumn(colNm);
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
          <AccordionItem key={table.name} value={table.name}>
            <AccordionTrigger
              className="py-2 hover:bg-accent rounded px-2"
              onClick={() => handleTableClick(table.name)}
            >
              <div className="flex items-center gap-2">
                <Table className="h-3 w-3" />
                <span className="text-sm font-medium">{table.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({table.columns.length})
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="pl-6 space-y-1">
                {table.columns.map((column) => {
                  const isSelected = selectedColumns.includes(column.name);
                  return (
                    <div
                      className={`flex items-start gap-2 py-1 px-2 rounded cursor-pointer text-sm ${isSelected ? "bg-primary/20 hover:bg-primary/30" : "hover:bg-accent"}`}
                      key={column.name}
                      onDoubleClick={() => handleColumnDoubleClick(column.name)}
                      title="Double-click to add to SELECT"
                    >
                      <Columns className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs">{column.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {column.type}
                          {/* {column.constraints.length > 0 && */}
                          {/* ` • ${column.constraints.join(", ")}`} */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
