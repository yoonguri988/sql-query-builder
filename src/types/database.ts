// Users 테이블
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  country: string;
}

// Products 테이블
export interface Product {
  id: number;
  name: string;
  category_id: number;
  price: number;
  stock: number;
  created_at: string;
}

// Categories 테이블
export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

// Orders 테이블
export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  order_date: string;
}

// Order Items 테이블
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

/** DB Schema MetaData */
export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
}

export interface ColumnSchema {
  name: string;
  type: "INTEGER" | "TEXT" | "REAL" | "DATE";
  constraints: string[];
}

/** Total Schema */
export const TABLES: TableSchema[] = [
  {
    name: "users",
    columns: [
      { name: "id", type: "INTEGER", constraints: ["PRIMARY KEY"] },
      { name: "name", type: "TEXT", constraints: ["NOT NULL"] },
      { name: "email", type: "TEXT", constraints: ["UNIQUE"] },
      { name: "created_at", type: "DATE", constraints: [] },
      { name: "country", type: "TEXT", constraints: [] },
    ],
  },
  {
    name: "products",
    columns: [
      { name: "id", type: "INTEGER", constraints: ["PRIMARY KEY"] },
      { name: "name", type: "TEXT", constraints: ["NOT NULL"] },
      { name: "category_id", type: "INTEGER", constraints: ["FOREIGN KEY"] },
      { name: "price", type: "REAL", constraints: ["NOT NULL"] },
      { name: "stock", type: "INTEGER", constraints: ["DEFAULT 0"] },
      { name: "created_at", type: "DATE", constraints: [] },
    ],
  },
  {
    name: "categories",
    columns: [
      { name: "id", type: "INTEGER", constraints: ["PRIMARY KEY"] },
      { name: "name", type: "TEXT", constraints: ["NOT NULL"] },
      { name: "parent_id", type: "INTEGER", constraints: [] },
    ],
  },
  {
    name: "orders",
    columns: [
      { name: "id", type: "INTEGER", constraints: ["PRIMARY KEY"] },
      { name: "user_id", type: "INTEGER", constraints: ["FOREIGN KEY"] },
      { name: "total_amount", type: "REAL", constraints: ["NOT NULL"] },
      { name: "status", type: "TEXT", constraints: [] },
      { name: "order_date", type: "DATE", constraints: ["NOT NULL"] },
    ],
  },
  {
    name: "order_items",
    columns: [
      { name: "id", type: "INTEGER", constraints: ["PRIMARY KEY"] },
      { name: "order_id", type: "INTEGER", constraints: ["FOREIGN KEY"] },
      { name: "product_id", type: "INTEGER", constraints: ["FOREIGN KEY"] },
      { name: "quantity", type: "INTEGER", constraints: ["NOT NULL"] },
      { name: "price", type: "REAL", constraints: ["NOT NULL"] },
    ],
  },
];
