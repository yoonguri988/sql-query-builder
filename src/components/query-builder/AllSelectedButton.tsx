import { CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo } from "react";

interface Props {
  value: boolean;
  onToggle: () => void;
}

function AllSelectedButton({ value, onToggle }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="h-8 text-xs"
    >
      {value ? (
        <>
          <Square className="h-3 w-3 mr-1" />
          전체 해제
        </>
      ) : (
        <>
          <CheckSquare className="h-3 w-3 mr-1" />
          전체 선택
        </>
      )}
    </Button>
  );
}
export default memo(AllSelectedButton);
