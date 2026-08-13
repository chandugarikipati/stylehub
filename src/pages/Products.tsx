import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import type { Product } from "../data/products";
import { getProducts } from "../api/products";

export default function Products() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const [sort, setSort] = useState("default");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts();
        console.log("Products extracted:", data);

        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Products fetch error:", err);
        if (!cancelled) {
          setProducts([]);
          setError(err instanceof Error ? err.message : "Unable to load products.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category) {
      const c = category.toLowerCase();
      result = c === "new"
        ? result.filter((p) => p.newArrival === true || p.isNew === true)
        : result.filter((p) => String(p.category || "").toLowerCase() === c);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.category || "").toLowerCase().includes(q) ||
        String(p.brand || "").toLowerCase().includes(q) ||
        (p.tags || []).some((tag) => String(tag).toLowerCase().includes(q))
      );
    }

    if (sort === "price-low") result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sort === "price-high") result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sort === "name") result.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));

    return result;
  }, [products, category, search, sort]);

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500">Home / Products</p>
          <h1 className="text-4xl font-bold text-black mt-3">
            {category ? (category.toLowerCase() === "new" ? "New Arrivals" : `${category} Collection`) : "All Products"}
          </h1>
          <p className="text-gray-600 mt-2">Discover your perfect style from StyleHub.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-black">Products</h2>
            <p className="text-gray-500 mt-1">
              {loading ? "Loading products..." : `${filteredProducts.length} products available`}
            </p>
          </div>

          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-black outline-none">
            <option value="default">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>

        {loading && <div className="text-center py-20 text-gray-600">Loading products...</div>}

        {!loading && error && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-red-600">Unable to load products</h3>
            <p className="text-gray-500 mt-2">{error}</p>
            <p className="text-sm text-gray-400 mt-2">Make sure backend is running on port 5000.</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-black">No products found</h3>
            <p className="text-gray-500 mt-2">The backend returned no products.</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={String(product._id ?? product.id)} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
