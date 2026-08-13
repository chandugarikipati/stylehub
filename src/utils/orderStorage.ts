import type { CartItem } from "../context/AppContext";

export type OrderStatus =
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: number;
  total: number;
  products: string[];

  cartItems: CartItem[];

  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  paymentMethod: "cod" | "online";
}

const ORDER_STORAGE_KEY = "stylehub_orders";

// =====================================================
// GET ALL ORDERS
// =====================================================

export function getOrders(): Order[] {
  try {
    const saved = localStorage.getItem(ORDER_STORAGE_KEY);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved) as Order[];
  } catch (error) {
    console.error("Failed to load orders:", error);
    return [];
  }
}

// =====================================================
// SAVE ALL ORDERS
// =====================================================

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(
      ORDER_STORAGE_KEY,
      JSON.stringify(orders)
    );
  } catch (error) {
    console.error("Failed to save orders:", error);
  }
}

// =====================================================
// CREATE NEW ORDER
// =====================================================

export function createOrder(
  cartItems: CartItem[],
  total: number,
  customer: Order["customer"],
  paymentMethod: "cod" | "online"
): Order {
  const existingOrders = getOrders();

  const orderNumber = String(
    341 + existingOrders.length + 1
  ).padStart(5, "0");

  const newOrder: Order = {
    id: `CHN-2026-${orderNumber}`,

    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),

    status: "Processing",

    items: cartItems.reduce(
      (sum, item) => sum + Number(item.qty || 0),
      0
    ),

    total,

    products: cartItems.map(
      (item) => item.productId
    ),

    cartItems,

    customer,

    paymentMethod,
  };

  saveOrders([
    newOrder,
    ...existingOrders,
  ]);

  return newOrder;
}

// =====================================================
// GET ORDER BY ID
// =====================================================

export function getOrderById(
  orderId: string
): Order | undefined {
  const orders = getOrders();

  return orders.find(
    (order) => order.id === orderId
  );
}

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): void {
  const orders = getOrders();

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status,
        }
      : order
  );

  saveOrders(updatedOrders);
}

// =====================================================
// DELETE ALL ORDERS
// Useful for testing
// =====================================================

export function clearAllOrders(): void {
  localStorage.removeItem(ORDER_STORAGE_KEY);
}

