import { useQueryStore } from "@/store/query-store";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash } from "lucide-react";

/**LimitInput 컴포넌트
 * LIMIT 절 값을 입력하는 필드
 *
 * 기능:
 * - 숫자만 입력 가능
 * - 양수만 허용
 * - 기본값: 100
 * - 빠른 선택 버튼 (10, 50, 100, 500)
 *
 * @component
 */
export default function LimitInput() {
  const { selectedTable, limit, setLimit } = useQueryStore();
  const [inputValue, setInputValue] = useState(limit.toString());

  // limit 상태 변경 시 inputValue 동기화
  useEffect(() => {
    setInputValue(limit.toString());
  }, [limit]);

  // 테이블이 선택되지 않았을 때
  if (!selectedTable) {
    return (
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Hash className="h-4 w-4" />
          LIMIT
        </Label>
        <div className="text-sm text-muted-foreground">
          먼저 테이블을 선택하세요
        </div>
      </div>
    );
  }

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 빈 값 허용 (입력 중)
    if (value === "") {
      setInputValue("");
      return;
    }

    // 숫자만 허용
    if (!/^\d+$/.test(value)) {
      return;
    }

    setInputValue(value);
    const numValue = parseInt(value, 10);

    // 양수만 허용
    if (numValue > 0) {
      setLimit(numValue);
    }
  };

  // blur 시 빈 값이면 기본값 복원
  const handleBlur = () => {
    if (inputValue === "" || parseInt(inputValue, 10) <= 0) {
      setInputValue("100");
      setLimit(100);
    }
  };

  // 빠른 선택 핸들러
  const handleQuickSelect = (value: number) => {
    setInputValue(value.toString());
    setLimit(value);
  };

  const quickValues = [10, 50, 100, 500];

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Hash className="h-4 w-4" />
        LIMIT
      </Label>

      {/* 입력 필드 */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="100"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-32"
        />
        <span className="text-sm text-muted-foreground">행</span>
      </div>

      {/* 빠른 선택 버튼 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">빠른 선택:</span>
        {quickValues.map((value) => (
          <Button
            key={value}
            type="button"
            variant={limit === value ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickSelect(value)}
            className="h-7 px-3 text-xs"
          >
            {value}
          </Button>
        ))}
      </div>

      {/* 안내 메시지 */}
      <div className="text-xs text-muted-foreground">
        💡 조회할 최대 행 수를 지정합니다. (기본값: 100)
      </div>
    </div>
  );
}
