import { Lightbulb } from "lucide-react";
import { memo } from "react";

interface Prop {
  msg?: string;
}

function UseTipMessage({ msg = "사용팁 메시지를 작성하지 않았습니다." }: Prop) {
  return (
    <div className="flex gap-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 rounded p-2">
      <Lightbulb className="w-3 h-4" />
      <div>{msg}</div>
    </div>
  );
}
export default memo(UseTipMessage);
