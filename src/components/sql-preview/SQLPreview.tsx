"use client";

/**
 * SQL 프리뷰 컴포넌트
 * - 생성된 SQL을 Syntax Highlighting하여 표시
 * - 에러가 있으면 에러 메시지 표시
 * - SQL이 없으면 안내 메시지 표시
 * - ExecuteButton을 포함하여 쿼리 실행 가능
 */

import { useQueryStore } from "@/store/query-store";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useToast } from "@/hooks/use-toast";
import ExecuteButton from "@/components/query-builder/ExecuteButton";
import { useTheme } from "next-themes";

interface SQLPreviewProps {
  onExecute?: () => void; // Results 탭 활성화 콜백
}

export default function SQLPreview({ onExecute }: SQLPreviewProps) {
  const generatedSQL = useQueryStore((state) => state.generatedSQL);
  const error = useQueryStore((state) => state.error);

  // 복사 Hook 사용
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const { toast } = useToast();
  const { theme } = useTheme();

  // 다크모드에 따라 스타일 선택
  const syntaxStyle = theme === "dark" ? vscDarkPlus : vs;

  // 복사 핸들러
  const handleCopy = async () => {
    if (generatedSQL) {
      const success = await copyToClipboard(generatedSQL);

      if (success) {
        // 복사 성공 Toast
        toast({
          title: "복사 완료",
          description: "SQL 쿼리가 클립보드에 복사되었습니다.",
          duration: 2000,
        });
      } else {
        // 복사 실패 Toast
        toast({
          title: "복사 실패",
          description: "클립보드 접근 권한을 확인해주세요.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  // 에러 상태
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start gap-2">
          <svg
            className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-100">
              검증 오류
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SQL이 없는 상태
  if (!generatedSQL) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          SQL 쿼리가 생성되지 않았습니다
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          왼쪽에서 테이블과 컬럼을 선택하면 SQL이 자동으로 생성됩니다
        </p>
      </div>
    );
  }

  // 정상 상태: SQL 표시 및 복사/실행 버튼
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">생성된 SQL</h3>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 dark:bg-green-950 text-xs font-medium text-green-700 dark:text-green-300">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            유효
          </span>

          {/* 복사 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 gap-1.5"
          >
            {isCopied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="text-xs">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="text-xs">복사</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Syntax Highlighting */}
      <div className="relative">
        <SyntaxHighlighter
          language="sql"
          style={syntaxStyle}
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            padding: "1rem",
            maxHeight: "400px",
            overflow: "auto",
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {generatedSQL}
        </SyntaxHighlighter>

        {/* SQL 줄 수 표시 */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{generatedSQL.split("\n").length} 줄</span>
          <span>{generatedSQL.length} 문자</span>
        </div>
      </div>

      {/* Execute 버튼 */}
      <ExecuteButton onExecute={onExecute} />
    </div>
  );
}
