import { Lightbulb } from "lucide-react";
import { memo } from "react";

interface Prop {
  msg?: string;
}

function HintMessage({ msg = "힌트 메시지를 작성하지 않았습니다." }: Prop) {
  return (
    <div className="text-xs text-muted-foreground flex">
      <Lightbulb className="w-3 h-4" />
      <div>{msg}</div>
    </div>
  );
}
export default memo(HintMessage);
