"use client";

import { memo, useCallback, useState } from "react";
import { useQueryStore } from "@/store/query-store";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw, Download } from "lucide-react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

function SQLEditor() {
  const [sqlText, setSqlText] = useState("");
  const { resolvedTheme } = useTheme();
  const executeQuery = useQueryStore((state) => state.executeQuery);
  const generatedSQL = useQueryStore((state) => state.generatedSQL);

  const handleExecute = useCallback(async () => {
    if (!sqlText.trim()) return;

    // SQL을 query-store에 설정하고 실행
    useQueryStore.setState({
      generatedSQL: sqlText.trim(),
    });

    // 쿼리 실행
    await executeQuery();

    // Results 탭으로 이동
  }, [sqlText, executeQuery]);

  const handleReset = useCallback(() => {
    setSqlText("");
  }, []);

  // Query Builder에서 불러오기
  const handleLoadFromBuilder = useCallback(() => {
    if (generatedSQL) {
      setSqlText(generatedSQL);
    }
  }, [generatedSQL]);

  // 에디터 값 변경 핸들러
  const handleEditorChange = useCallback((value: string | undefined) => {
    setSqlText(value || "");
  }, []);

  // 에디터 마운트 핸들러
  const handleEditorDidMount: OnMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      // 에디터 옵션 설정
      editor.updateOptions({
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "on",
        wrappingIndent: "indent",
        formatOnPaste: true,
        formatOnType: true,
      });

      // Ctrl+Enter 또는 Cmd+Enter로 쿼리 실행
      editor.addCommand(
        // Monaco KeyMod과 KeyCode 사용
        2048 | 3, // CtrlCmd (2048) + Enter (3)
        () => {
          const currentValue = editor.getValue();
          if (currentValue.trim()) {
            setSqlText(currentValue);
            // 실행 함수 호출을 위해 setTimeout 사용
            setTimeout(() => {
              if (currentValue.trim()) {
                useQueryStore.setState({
                  generatedSQL: currentValue.trim(),
                });
                useQueryStore.getState().executeQuery();
              }
            }, 0);
          }
        }
      );
    },
    []
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>SQL Editor</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadFromBuilder}
              disabled={!generatedSQL}
            >
              <Download className="h-4 w-4 mr-2" />
              Query Builder에서 불러오기
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Monaco Editor */}
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="sql"
              language="sql"
              value={sqlText}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
              options={{
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: "line",
                automaticLayout: true,
                minimap: { enabled: false },
                scrollbar: {
                  vertical: "auto",
                  horizontal: "auto",
                },
                fontSize: 14,
                lineNumbers: "on",
                wordWrap: "on",
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                tabSize: 2,
              }}
              loading={
                <div className="flex items-center justify-center h-[400px]">
                  Loading editor...
                </div>
              }
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button onClick={handleExecute} disabled={!sqlText.trim()}>
              <Play className="h-4 w-4 mr-2" />
              실행 (Ctrl+Enter)
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              초기화
            </Button>
          </div>

          {/* 도움말 */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              • Ctrl+Enter (또는 Cmd+Enter)를 눌러 쿼리를 빠르게 실행할 수
              있습니다
            </p>
            <p>• Ctrl+Space: 자동완성</p>
            <p>• Alt+Shift+F: 코드 포맷팅</p>
            <p>• Ctrl+F: 찾기, Ctrl+H: 바꾸기</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default memo(SQLEditor);
