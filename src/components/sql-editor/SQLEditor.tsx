"use client";

import { useState } from "react";
import { useQueryStore } from "@/store/query-store";
import { useUIStore } from "@/store/ui-store";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw, Download } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SQLEditor() {
  const [sqlText, setSqlText] = useState("");
  const { theme } = useTheme();
  const executeQuery = useQueryStore((state) => state.executeQuery);
  const generatedSQL = useQueryStore((state) => state.generatedSQL);
  const { setActiveRightPanelTab } = useUIStore();

  const syntaxStyle = theme === "dark" ? vscDarkPlus : vs;

  const handleExecute = async () => {
    if (!sqlText.trim()) return;

    // SQL을 query-store에 설정하고 실행
    useQueryStore.setState({
      generatedSQL: sqlText.trim(),
    });

    // 쿼리 실행
    await executeQuery();

    // Results 탭으로 이동
    setActiveRightPanelTab("results");
  };

  const handleReset = () => {
    setSqlText("");
  };

  // Query Builder에서 불러오기
  const handleLoadFromBuilder = () => {
    if (generatedSQL) {
      setSqlText(generatedSQL);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>SQL Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SQL 입력 영역 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">SQL Query</label>
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
            <Textarea
              value={sqlText}
              onChange={(e) => setSqlText(e.target.value)}
              placeholder="SELECT * FROM users WHERE age > 18 ORDER BY name ASC LIMIT 10;"
              className="font-mono min-h-[200px]"
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button onClick={handleExecute} disabled={!sqlText.trim()}>
              <Play className="h-4 w-4 mr-2" />
              실행
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              초기화
            </Button>
          </div>

          {/* 미리보기 */}
          {sqlText && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div className="border rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language="sql"
                  style={syntaxStyle}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                  }}
                >
                  {sqlText}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
