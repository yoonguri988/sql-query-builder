interface Props {
  whereCondCount: number;
}
export default function WhereClauseInfo({ whereCondCount }: Props) {
  if (whereCondCount === 0) return <div>조건 없음 (모든 행 조회)</div>;
  else {
    return (
      <div className="flex justify-between">
        <div>
          조건{" "}
          <span className="font-semibold text-foreground">
            {whereCondCount}
          </span>{" "}
          개
        </div>
        {whereCondCount > 3 && (
          <div className="text-xs text-orange-600 dark:text-orange-400">
            많은 조건은 쿼리 속도를 저하시킬 수 있습니다
          </div>
        )}
      </div>
    );
  }
}
