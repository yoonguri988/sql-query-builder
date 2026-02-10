import { memo } from "react";
import { TableColumn, TableSchema } from "@/types/database";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Table } from "../ui/table";
import { useQueryStore } from "@/store/query-store";
import DBSchemaColumnItem from "./DBSchemaColumnItem";

interface Props {
  table: TableSchema;
  columns: TableColumn[];
  onClick: (name: string) => void;
}

function DBSchemaTableItem({ table, columns, onClick }: Props) {
  const selectedColumns = useQueryStore((state) => state.selectedColumns);
  const toggleColumn = useQueryStore((state) => state.toggleColumn);

  const handleColumnDoubleClick = (name: string) => {
    toggleColumn(name);
  };

  return (
    <AccordionItem value={table.name}>
      <AccordionTrigger
        className="py-2 hover:bg-accent rounded px-2"
        onClick={() => onClick(table.name)}
      >
        <div className="flex items-center gap-2">
          <Table className="h-3 w-3" />
          <span className="text-sm font-medium">{table.name}</span>
          <span className="text-xs text-muted-foreground">
            ({columns.length})
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <div className="pl-6 space-y-1">
          {columns.map((column) => (
            <DBSchemaColumnItem
              key={column.name}
              column={column}
              isSelected={selectedColumns.includes(column.name)}
              onClick={handleColumnDoubleClick}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default memo(DBSchemaTableItem);
