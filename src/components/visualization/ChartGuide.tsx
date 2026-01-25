"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

export default function ChartGuide() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Alert>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          <Info className="h-4 w-4 mt-0.5" />
          <div className="flex-1">
            <AlertTitle className="flex items-center justify-between">
              차트 사용 팁
            </AlertTitle>
            {isOpen && (
              <AlertDescription className="space-y-2 mt-2">
                <p>1. X축: 카테고리나 날짜 컬럼을 선택하세요</p>
                <p>2. Y축: 숫자형 컬럼을 선택하세요 (여러 개 가능)</p>
                <p>3. Pie Chart는 Y축을 1개만 선택할 수 있습니다</p>
                <p>4. 데이터가 많은 경우 LIMIT를 사용하여 제한하세요</p>
              </AlertDescription>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-auto p-1 ml-2"
          /** 접근성 개선 */
          aria-label={isOpen ? "가이드 접기" : "가이드 펼치기"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Alert>
  );
}
