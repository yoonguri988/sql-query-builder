import { useQueryStore } from "@/store/query-store";
import { getTableNames } from "@/types/schema";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "lucide-react";

/**
 * FROM 절에서 사용할 테이블을 선택하는 드롭 다운
 *
 * 기능
 * - DB Schema에서 정의된 테이블 목록 표시
 * - 테이블 선택시 zustand 스토어에서 업데이트
 * - 테이블 변경시 컬럼 선택 자동 초기화
 * - 선택된 테이블읠 컬럼 목록 자동 로드
 * @component
 * @example
 * <TableSelector />
 */
export default function TableSelector() {
  const { selectedTable, setSelectedTable } = useQueryStore();
  const tblNms = getTableNames();

  const handleTableChange = (v: string) => {
    setSelectedTable(v);
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor="table-select"
        className="flex items-center gap-2 text-sm font-medium"
      >
        <Database className="h-4 w-4" />
        FROM
      </Label>

      <Select value={selectedTable} onValueChange={handleTableChange}>
        <SelectTrigger id="table-select" className="w-full">
          <SelectValue placeholder="테이블을 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {tblNms.map((tblNm) => (
            <SelectItem key={tblNm} value={tblNm}>
              <span className="font-mono">{tblNm}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTable && (
        <p className="text-xs text-muted-foreground mt-1">
          선택된 테이블:{" "}
          <span className="font-mono font-semibold text-foreground">
            {selectedTable}
          </span>
        </p>
      )}
    </div>
  );
}
