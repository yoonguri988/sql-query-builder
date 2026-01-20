import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface SortingIconProps {
  isSorted: false | "asc" | "desc";
}

/**
 * 정렬 상태를 시각적으로 표시하는 아이콘 컴포넌트
 * - asc: 오름차순 (위쪽 화살표)
 * - desc: 내림차순 (아래쪽 화살표)
 * - false: 정렬 안됨 (양방향 화살표, 투명도 적용)
 */
export default function SortingIcon({ isSorted }: SortingIconProps) {
  if (isSorted === "asc") {
    return (
      <ArrowUp
        className="h-4 w-4 text-primary transition-all duration-200"
        aria-label="Sorted ascending"
      />
    );
  }

  if (isSorted === "desc") {
    return (
      <ArrowDown
        className="h-4 w-4 text-primary transition-all duration-200"
        aria-label="Sorted descending"
      />
    );
  }

  return (
    <ArrowUpDown
      className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200"
      aria-label="Not sorted - click to sort"
    />
  );
}
