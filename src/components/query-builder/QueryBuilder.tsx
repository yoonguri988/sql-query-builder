"use client";

import useTableColumns from "@/hooks/useTableColumns";
import { useQueryStore } from "@/store/query-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code2, Database } from "lucide-react";
import TableSelector from "@/components/query-builder/TableSelector";

/** Query Builder 메인 컴포넌트
 *
 * 기능
 * - FROM 절: 테이블 선택 드롭 다운
 * - 선택된 테이블의 컬럼 정보 자동 로드 및 표시
 * - 생선된 SQL 실시간 미리보기
 * @returns
 */
export default function QueryBuilder() {
  const { selectedTable, generatedSQL } = useQueryStore();
  const columns = useTableColumns();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            Query Builder
          </CardTitle>
          <CardDescription>시각적으로 SQL 쿼리를 구성하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 8일차: FROM 절 - TableSelector */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">1. 테이블 선택</h3>
            <TableSelector />
          </div>

          {/* 선택된 테이블의 컬럼 정보 표시 (8일차: 컬럼 로드 로직 테스트) */}
          {selectedTable && columns.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                2. 테이블 구조{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({columns.length}개 컬럼)
                </span>
              </h3>
              <div className="rounded-md border bg-muted/50 p-4">
                <div className="space-y-2">
                  {columns.map((column) => (
                    <div
                      key={column.name}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="font-mono font-semibold min-w-[120px]">
                        {column.name}
                      </span>
                      <span className="text-muted-foreground text-xs px-2 py-0.5 rounded bg-background">
                        {column.type}
                      </span>
                      {column.primaryKey && (
                        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded font-medium">
                          PK
                        </span>
                      )}
                      {column.foreignKey && (
                        <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-0.5 rounded font-medium">
                          FK → {column.foreignKey.table}.
                          {column.foreignKey.column}
                        </span>
                      )}
                      {!column.nullable && (
                        <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-0.5 rounded font-medium">
                          NOT NULL
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ✅ 컬럼 정보가 성공적으로 로드되었습니다.
              </p>
            </div>
          )}

          {/* 생성된 SQL 미리보기 */}
          {generatedSQL && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">3. 생성된 SQL</h3>
              <div className="rounded-md bg-slate-950 dark:bg-slate-900 p-4 border">
                <code className="text-sm text-slate-50 font-mono whitespace-pre-wrap break-all">
                  {generatedSQL}
                </code>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 테이블 선택 시 기본 쿼리가 자동으로 생성됩니다.
              </p>
            </div>
          )}

          {!selectedTable && (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>테이블을 선택하여 쿼리 빌더를 시작하세요</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
