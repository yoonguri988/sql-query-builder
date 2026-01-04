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
export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
}

export interface TableSchema {
  name: string;
  columns: TableColumn[];
}
