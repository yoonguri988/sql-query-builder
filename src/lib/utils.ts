import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * SQL Injection 방지 헬퍼 함수
 * - SQL Injection 방지를 위한 작은따옴표 이스케이프
 * - 작은따옴표(')를 두 개('')로 변환
 */
export function escapeSQLString(value: string | number): string {
  const strValue = String(value);
  return strValue.replace(/'/g, "''");
}
