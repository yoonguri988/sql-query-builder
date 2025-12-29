import { randomDate, randomInt, randomItem, randomPrice } from "./data-helpers";

// 샘플 이름 데이터
const FIRST_NAMES = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];

const COUNTRIES = [
  "USA",
  "Canada",
  "UK",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Australia",
  "Japan",
  "South Korea",
];

export function generateUsers(count: number = 20): string {
  const users: string[] = [];
  const startDate = new Date(2022, 0, 1);
  const endDate = new Date(2024, 11, 31);

  for (let i = 1; i <= count; i++) {
    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`;
    const createdAt = randomDate(startDate, endDate);
    const country = randomItem(COUNTRIES);

    users.push(
      `INSERT INTO users (name, email, created_at, country) VALUES ('${name}', '${email}', '${createdAt}', '${country}');`
    );
  }

  return users.join("\n");
}

/** Category 샘플 데이터 */
export function generateCategories(): string {
  const categories = [
    // 최상위 카테고리
    { id: 1, name: "Electronics", parent_id: null },
    { id: 2, name: "Clothing", parent_id: null },
    // 하위 카테고리 (Electronics)
    { id: 3, name: "Laptops", parent_id: 1 },
    { id: 4, name: "Smartphones", parent_id: 1 },
    // 하위 카테고리 (Clothing)
    { id: 5, name: "Men", parent_id: 2 },
    { id: 6, name: "Women", parent_id: 2 },
  ];

  return categories
    .map((cat) => {
      const parentId = cat.parent_id === null ? "NULL" : cat.parent_id;
      return `INSERT INTO categories (id, name, parent_id) VALUES (${cat.id}, '${cat.name}', ${parentId});`;
    })
    .join("\n");
}

/** Product 샘플 데이터 */
const LAPTOP_BRANDS = ["Dell", "HP", "Lenovo", "Apple", "ASUS"];
const PHONE_BRANDS = ["iPhone", "Samsung Galaxy", "Google Pixel", "OnePlus"];
const CLOTHING_TYPES = [
  "T-Shirt",
  "Jeans",
  "Dress",
  "Jacket",
  "Sweater",
  "Shorts",
  "Skirt",
  "Hoodie",
  "Polo Shirt",
  "Blouse",
];

export function generateProducts(count: number = 100): string {
  const products: string[] = [];
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date(2024, 11, 31);

  for (let i = 1; i <= count; i++) {
    let name: string;
    let categoryId: number;
    let price: number;
    let stock: number;

    // 카테고리별로 상품 분배
    if (i <= 35) {
      // Laptops (35개)
      name = `${randomItem(LAPTOP_BRANDS)} Laptop ${randomInt(100, 999)}`;
      categoryId = 3;
      price = randomPrice(500, 2500);
      stock = randomInt(0, 50);
    } else if (i <= 65) {
      // Smartphones (30개)
      name = `${randomItem(PHONE_BRANDS)} ${randomInt(11, 15)} Pro`;
      categoryId = 4;
      price = randomPrice(300, 1500);
      stock = randomInt(0, 100);
    } else {
      // Clothing (35개)
      name = `${randomItem(CLOTHING_TYPES)} - ${randomItem(["Black", "White", "Blue", "Red", "Gray"])}`;
      categoryId = i % 2 === 0 ? 5 : 6; // Men or Women
      price = randomPrice(20, 150);
      stock = randomInt(0, 200);
    }

    const createdAt = randomDate(startDate, endDate);

    products.push(
      `INSERT INTO products (name, category_id, price, stock, created_at) VALUES ('${name}', ${categoryId}, ${price}, ${stock}, '${createdAt}');`
    );
  }

  return products.join("\n");
}

/** Orders 샘플 데이터  */
const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function generateOrders(
  count: number = 150,
  userCount: number = 20
): string {
  const orders: string[] = [];
  const startDate = new Date(2023, 6, 1); // 2023년 7월부터
  const endDate = new Date(2024, 11, 31);

  for (let i = 1; i <= count; i++) {
    const userId = randomInt(1, userCount);
    const totalAmount = randomPrice(50, 1000);
    const status = randomItem(ORDER_STATUSES);
    const orderDate = randomDate(startDate, endDate);

    orders.push(
      `INSERT INTO orders (user_id, total_amount, status, order_date) VALUES (${userId}, ${totalAmount}, '${status}', '${orderDate}');`
    );
  }

  return orders.join("\n");
}

/** Order Items 샘플 데이터 */
export function generateOrderItems(
  orderCount: number = 150,
  productCount: number = 100
): string {
  const orderItems: string[] = [];

  for (let orderId = 1; orderId <= orderCount; orderId++) {
    // 각 주문당 1~3개의 상품
    const itemsPerOrder = randomInt(1, 3);

    for (let j = 0; j < itemsPerOrder; j++) {
      const productId = randomInt(1, productCount);
      const quantity = randomInt(1, 5);
      const price = randomPrice(20, 500);

      orderItems.push(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (${orderId}, ${productId}, ${quantity}, ${price});`
      );
    }
  }

  return orderItems.join("\n");
}

/** 통합 데이터 생성 함수 */
export function generateAllSampleData(): string {
  const sql: string[] = [];

  // 순서 중요: 외래 키 제약조건 때문에
  sql.push("-- Users");
  sql.push(generateUsers(20));
  sql.push("");

  sql.push("-- Categories");
  sql.push(generateCategories());
  sql.push("");

  sql.push("-- Products");
  sql.push(generateProducts(100));
  sql.push("");

  sql.push("-- Orders");
  sql.push(generateOrders(150, 20));
  sql.push("");

  sql.push("-- Order Items");
  sql.push(generateOrderItems(150, 100));

  return sql.join("\n");
}
