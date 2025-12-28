export const CREATE_TABLES_SQL = `
-- Users 테이블
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at DATE,
  country TEXT
);

-- Categories 테이블
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  parent_id INTEGER,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Products 테이블
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category_id INTEGER,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at DATE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders 테이블
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  total_amount REAL NOT NULL,
  status TEXT,
  order_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items 테이블
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
`;
