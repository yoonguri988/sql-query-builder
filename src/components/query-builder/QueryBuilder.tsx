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
import WhereClauseBuilder from "@/components/query-builder/WhereClauseBuilder";
import { Separator } from "@/components/ui/separator";
import OrderBySelector from "./OrderBySelector";
import LimitInput from "./LimitInput";
import ActionButtons from "./ActionButtons";

/** Query Builder 메인 컴포넌트
 *
 * 기능
 * - [260101] FROM 절: 테이블 선택 드롭 다운
 * - [260101] SELECT 절: 컬럼 선택 Multi-Checkbox
 * - [260102] WHERE 절: 조건 빌더
 * - [260103] ORDER BY 절: 정렬 선택
 * - [260103] LIMIT 절: 행 수 제한
 * - [260103] 액션 버튼: Reset/Execute
 * - 선택된 테이블의 컬럼 정보 자동 로드 및 표시
 * - 생선된 SQL 실시간 미리보기
 * @returns
 */
export default function QueryBuilder() {
  const {
    selectedTable,
    // selectedColumns,
    // whereConditions,
    // orderBy,
    // limit,
    // generatedSQL,
  } = useQueryStore();

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
          {/* 1. FROM 절 - TableSelector */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">1. 테이블 선택</h3>
            <TableSelector />
          </div>

          {selectedTable && (
            <>
              <Separator />
              {/* 2. SELECT 절 - ColumnSelector */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">2. 컬럼 선택 (SELECT)</h3>
                <ColumnSelector />
              </div>

              <Separator />
              {/* 3. WHERE 절 - WhereClauseBuilder */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">3. 조건 설정 (WHERE)</h3>
                <WhereClauseBuilder />
              </div>

              <Separator />
              {/* 4. ORDER BY 절 - OrderBySelector */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  4. 정렬 설정 (ORDER BY)
                </h3>
                <OrderBySelector />
              </div>

              <Separator />
              {/* 5. LIMIT 절 - LimitInput */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">5. 행 수 제한 (LIMIT)</h3>
                <LimitInput />
              </div>

              {/* 생성된 SQL 미리보기 */}
              {/*generatedSQL && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">6. 생성된 SQL</h3>
                  <div className="rounded-md bg-slate-950 dark:bg-slate-900 p-4 border">
                    <code className="text-sm text-slate-50 font-mono whitespace-pre-wrap break-all">
                      {generatedSQL}
                    </code>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>📊 쿼리 정보:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li>
                        SELECT:{" "}
                        {selectedColumns.length === 0
                          ? "모든 컬럼 (*)"
                          : `${selectedColumns.length}개 컬럼`}
                      </li>
                      <li>FROM: {selectedTable}</li>
                      {whereConditions.length > 0 && (
                        <li>WHERE: {whereConditions.length}개 조건</li>
                      )}
                      {orderBy.length > 0 && (
                        <li>ORDER BY: {orderBy.length}개 정렬</li>
                      )}
                      <li>LIMIT: {limit}행</li>
                    </ul>
                  </div>
                </div>
              )*/}

              {/* 액션 버튼 */}
              <ActionButtons />
            </>
          )}

          {/* 빈 상태 */}
          {!selectedTable && (
            <div className="text-center py-12 text-muted-foreground">
              <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">쿼리 빌더 시작하기</p>
              <p className="text-sm">
                테이블을 선택하여 SQL 쿼리를 만들어보세요
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
