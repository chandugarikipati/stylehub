import type { Product } from "../data/products";

const API_URL = "http://localhost:5000/api";

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

  if (Array.isArray(data)) {
    return data as Product[];
  }

  if (Array.isArray(data.products)) {
    return data.products as Product[];
  }

  return [];
}

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
  // { success: true, product: {...} }

  if (data?.product) {
    return data.product as Product;
  }

  return data as Product;
}