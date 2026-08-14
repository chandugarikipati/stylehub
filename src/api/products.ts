import type { Product } from "../data/products";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

// =====================================================
// GET ALL PRODUCTS
// =====================================================

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_URL}/products`
  );

  const data = await response.json();

  console.log(
    "📦 Products API response:",
    data
  );

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Failed to fetch products: ${response.status}`
    );
  }

  // Backend may return:
  // [ ...products ]

  if (Array.isArray(data)) {
    return data as Product[];
  }

  // Backend currently returns:
  // {
  //   success: true,
  //   products: [...]
  // }

  if (Array.isArray(data.products)) {
    return data.products as Product[];
  }

  // Support APIs that return:
  // {
  //   data: [...]
  // }

  if (Array.isArray(data.data)) {
    return data.data as Product[];
  }

  console.warn(
    "⚠️ Products API returned an unexpected format:",
    data
  );

  return [];
}


// =====================================================
// GET PRODUCT BY ID
// =====================================================

export async function getProductById(
  id: string
): Promise<Product> {
  const response = await fetch(
    `${API_URL}/products/${encodeURIComponent(id)}`
  );

  const data = await response.json();

  console.log(
    "📦 Single product API response:",
    data
  );

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Failed to fetch product: ${response.status}`
    );
  }

  // Backend response:
  // {
  //   success: true,
  //   product: {...}
  // }

  if (data?.product) {
    return data.product as Product;
  }

  // Support:
  // {
  //   data: {...}
  // }

  if (data?.data) {
    return data.data as Product;
  }

  return data as Product;
}