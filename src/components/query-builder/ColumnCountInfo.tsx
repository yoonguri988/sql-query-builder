interface Props {
  selectedCount: number;
  totalCount: number;
}
export default function ColumnCountInfo({ selectedCount, totalCount }: Props) {
  if (totalCount === 0) {
    return <span>선택된 컬럼 없음 (SELECT * 사용)</span>;
  } else {
    return (
      <span>
        선택된 컬럼:{" "}
        <span className="font-semibold text-foreground">{selectedCount}</span> /{" "}
        {totalCount}
      </span>
    );
  }
}
