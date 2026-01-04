import { useQueryStore } from "@/store/query-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Database, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

/**
 * ResultsTable 컴포넌트
 * SQL 쿼리 실행 결과를 테이블로 표시
 *
 * 기능:
 * - 결과 테이블 표시
 * - 실행 시간 표시
 * - 행 개수 표시
 * - CSV 다운로드 (선택적)
 *
 * @component
 */
export default function ResultsTable() {
  const { queryResult, executionTime, error } = useQueryStore();

  // 결과가 없을 때
  if (!queryResult && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            쿼리 결과
          </CardTitle>
          <CardDescription>
            Execute 버튼을 클릭하여 쿼리를 실행하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>아직 실행된 쿼리가 없습니다</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Database className="h-5 w-5" />
            쿼리 오류
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4">
            <p className="text-sm text-red-800 dark:text-red-200 font-mono">
              {error}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 결과가 있을 때
  if (!queryResult || queryResult.columns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            쿼리 결과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>결과가 없습니다 (0 rows)</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { columns, values } = queryResult;

  // CSV 다운로드
  const handleDownloadCSV = () => {
    const csvContent = [
      columns.join(","),
      ...values.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `query_results_${Date.now()}.csv`;
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              쿼리 결과
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1">
                <strong>{values.length}</strong> rows
              </span>
              {executionTime !== null && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <strong>{executionTime}</strong> ms
                </span>
              )}
            </CardDescription>
          </div>

          {/* CSV 다운로드 버튼 */}
          <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV 다운로드
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead key={index} className="font-mono font-semibold">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {values.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="font-mono text-sm">
                        {cell === null ? (
                          <span className="text-muted-foreground italic">
                            NULL
                          </span>
                        ) : (
                          String(cell)
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* 페이지네이션 안내 */}
        {values.length >= 100 && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            💡 많은 결과가 표시되고 있습니다. LIMIT을 사용하여 결과를 제한할 수
            있습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
