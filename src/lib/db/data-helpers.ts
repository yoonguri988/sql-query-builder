/** 랜덤 날짜 생성 */
export function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
}

/** 랜덤 아이템 선택 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// 랜덤 정수 생성
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 랜덤 가격 생성 (소수점 2자리)
export function randomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}
