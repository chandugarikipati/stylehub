// src/data/products.ts

export interface Product {
  id?: string;
  _id?: string;

  name: string;
  brand: string;
  description: string;

  price: number;
  originalPrice: number;
  discount: number;

  category: string;
  gender: string;

  image: string;
  images?: string[];

  sizes?: string[];
  colors?: string[];
  colorHex?: string[];

  inStock?: boolean;
  stockCount?: number;

  newArrival?: boolean;
  isNew?: boolean;

  isBestSeller?: boolean;
  isTrending?: boolean;

  rating?: number;
  reviewCount?: number;

  material?: string;
  fit?: string;

  tags?: string[];

  createdAt?: string;
  updatedAt?: string;
}


// =====================================================
// CATEGORIES
// =====================================================

export const categories = [
  {
    slug: "women",
    name: "Women",
  },
  {
    slug: "men",
    name: "Men",
  },
  {
    slug: "kids",
    name: "Kids",
  },
  {
    slug: "accessories",
    name: "Accessories",
  },
];


// =====================================================
// LOCAL PRODUCTS
// =====================================================
// This can be empty because your real products
// are coming from MongoDB.

export const products: Product[] = [];


// =====================================================
// BEST SELLERS
// =====================================================

export function getBestSellers(
  list: Product[] = products
): Product[] {
  return list
    .filter((product) => product.isBestSeller)
    .sort(
      (a, b) =>
        Number(b.reviewCount || 0) -
        Number(a.reviewCount || 0)
    );
}


// =====================================================
// NEW ARRIVALS
// =====================================================

export function getNewArrivals(
  list: Product[] = products
): Product[] {
  return list.filter(
    (product) =>
      product.newArrival === true ||
      product.isNew === true
  );
}


// =====================================================
// TRENDING PRODUCTS
// =====================================================

export function getTrending(
  list: Product[] = products
): Product[] {
  return list.filter(
    (product) => product.isTrending === true
  );
}


// =====================================================
// PRODUCTS BY CATEGORY
// =====================================================

export function getProductsByCategory(
  category: string,
  list: Product[] = products
): Product[] {
  if (category === "all") {
    return list;
  }

  return list.filter(
    (product) =>
      product.category?.toLowerCase() ===
      category.toLowerCase()
  );
}


// =====================================================
// PRODUCT BY ID
// =====================================================

export function getProductById(
  id: string,
  list: Product[] = products
): Product | undefined {
  return list.find(
    (product) =>
      String(product.id || product._id) ===
      String(id)
  );
}

