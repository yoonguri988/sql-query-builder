import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

// 정렬 아이콘 컴포넌트
export default function SortingIcon({
  isSorted,
}: {
  isSorted: false | "asc" | "desc";
}) {
  if (isSorted === "asc") {
    return <ArrowUp className="h-4 w-4" />;
  }
  if (isSorted === "desc") {
    return <ArrowDown className="h-4 w-4" />;
  }
  return <ArrowUpDown className="h-4 w-4 opacity-50" />;
}
