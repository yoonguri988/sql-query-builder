"use client";

import { useQueryStore } from "@/store/query-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code2 } from "lucide-react";
import TableSelector from "@/components/query-builder/TableSelector";
import ColumnSelector from "@/components/query-builder/ColumnSelector";

/** Query Builder 메인 컴포넌트
 *
 * 기능
 * - [260101] FROM 절: 테이블 선택 드롭 다운
 * - [260101] SELECT 절: 컬럼 선택 Multi-Checkbox
 * - 선택된 테이블의 컬럼 정보 자동 로드 및 표시
 * - 생선된 SQL 실시간 미리보기
 * @returns
 */
export default function QueryBuilder() {
  const { selectedTable, selectedColumns, generatedSQL } = useQueryStore();

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
          {/* FROM 절 - TableSelector */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">1. 테이블 선택</h3>
            <TableSelector />
          </div>

          {/* SELECT 절 - ColumnSelector */}
          {selectedTable && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">2. 컬럼 선택 (SELECT)</h3>
              <ColumnSelector />
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
              <div className="text-xs text-muted-foreground space-y-1">
                <p>💡 컬럼 선택에 따라 SQL이 자동으로 업데이트됩니다.</p>
                {selectedColumns.length === 0 ? (
                  <p>
                    • 선택된 컬럼이 없으므로
                    <span className="font-mono font-semibold">SELECT *</span>가
                    사용됩니다.
                  </p>
                ) : (
                  <p>
                    • 선택된
                    <span className="font-semibold">
                      {selectedColumns.length}개
                    </span>
                    컬럼만 조회됩니다.
                  </p>
                )}
              </div>
            </div>
          )}

          {!selectedTable && (
            <div className="text-center py-12 text-muted-foreground">
              <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>테이블을 선택하여 쿼리 빌더를 시작하세요</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
