import type { TableSchema } from "@/types/database";

/**
 * E-commerce 샘플 데이터베이스 스키마
 * 예시DB스키마.pdf에 정의된 구조
 *
 * 테이블:
 * - users: 사용자 (약 20명)
 * - products: 상품 (약 100개)
 * - categories: 카테고리 (Electronics, Clothing 등)
 * - orders: 주문 (약 150개)
 * - order_items: 주문 상세 (약 300개)
 */

export const DATABASE_SCHEMA: TableSchema[] = [
  {
    name: "users",
    columns: [
      { name: "id", type: "INTEGER", nullable: false, primaryKey: true },
      { name: "name", type: "TEXT", nullable: false, primaryKey: false },
      { name: "email", type: "TEXT", nullable: true, primaryKey: false },
      { name: "created_at", type: "DATE", nullable: true, primaryKey: false },
      { name: "country", type: "TEXT", nullable: true, primaryKey: false },
    ],
  },
  {
    name: "products",
    columns: [
      { name: "id", type: "INTEGER", nullable: false, primaryKey: true },
      { name: "name", type: "TEXT", nullable: false, primaryKey: false },
      {
        name: "category_id",
        type: "INTEGER",
        nullable: true,
        primaryKey: false,
        foreignKey: { table: "categories", column: "id" },
      },
      { name: "price", type: "REAL", nullable: false, primaryKey: false },
      { name: "stock", type: "INTEGER", nullable: true, primaryKey: false },
      { name: "created_at", type: "DATE", nullable: true, primaryKey: false },
    ],
  },
  {
    name: "categories",
    columns: [
      { name: "id", type: "INTEGER", nullable: false, primaryKey: true },
      { name: "name", type: "TEXT", nullable: false, primaryKey: false },
      { name: "parent_id", type: "INTEGER", nullable: true, primaryKey: false },
    ],
  },
  {
    name: "orders",
    columns: [
      { name: "id", type: "INTEGER", nullable: false, primaryKey: true },
      {
        name: "user_id",
        type: "INTEGER",
        nullable: false,
        primaryKey: false,
        foreignKey: { table: "users", column: "id" },
      },
      {
        name: "total_amount",
        type: "REAL",
        nullable: false,
        primaryKey: false,
      },
      { name: "status", type: "TEXT", nullable: true, primaryKey: false },
      { name: "order_date", type: "DATE", nullable: false, primaryKey: false },
    ],
  },
  {
    name: "order_items",
    columns: [
      { name: "id", type: "INTEGER", nullable: false, primaryKey: true },
      {
        name: "order_id",
        type: "INTEGER",
        nullable: false,
        primaryKey: false,
        foreignKey: { table: "orders", column: "id" },
      },
      {
        name: "product_id",
        type: "INTEGER",
        nullable: false,
        primaryKey: false,
        foreignKey: { table: "products", column: "id" },
      },
      { name: "quantity", type: "INTEGER", nullable: false, primaryKey: false },
      { name: "price", type: "REAL", nullable: false, primaryKey: false },
    ],
  },
];

/**
 * 테이블명 목록 가져오기
 */
export function getTableNames(): string[] {
  return DATABASE_SCHEMA.map((table) => table.name);
}

/**
 * 특정 테이블의 컬럼 목록 가져오기
 */
export function getTableColumns(tableName: string) {
  const table = DATABASE_SCHEMA.find((t) => t.name === tableName);
  return table?.columns || [];
}

/**
 * 특정 테이블의 스키마 가져오기
 */
export function getTableSchema(tableName: string): TableSchema | undefined {
  return DATABASE_SCHEMA.find((t) => t.name === tableName);
}

/**
 * 컬럼명 목록만 가져오기
 */
export function getColumnNames(tableName: string): string[] {
  return getTableColumns(tableName).map((col) => col.name);
}
