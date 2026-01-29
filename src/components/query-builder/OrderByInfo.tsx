interface Props {
  totalCount: number;
}
export default function OrderByInfo({ totalCount }: Props) {
  if (totalCount === 0) return <div>정렬 없음 (기본 순서)</div>;
  else {
    return (
      <div className="flex justify-between">
        <div>
          정렬{" "}
          <span className="font-semibold text-foreground">{totalCount}</span> 개
        </div>
      </div>
    );
  }
}
