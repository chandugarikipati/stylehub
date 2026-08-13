import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import type { Product } from "../data/products";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const categories = [
  {
    name: "Men",
    description: "Explore Men's Collection",
    link: "/products?category=men",
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Women",
    description: "Explore Women's Collection",
    link: "/products?category=women",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Kids",
    description: "Explore Kids Collection",
    link: "/products?category=kids",
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Accessories",
    description: "Complete Your Look",
    link: "/products?category=accessories",
    image:
      "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch products: ${response.status}`
          );
        }

        const result = await response.json();

        console.log(
          "Home products API response:",
          result
        );

        let extractedProducts: Product[] = [];

        if (Array.isArray(result)) {
          extractedProducts = result;
        } else if (
          Array.isArray(result.products)
        ) {
          extractedProducts = result.products;
        } else if (
          Array.isArray(result.data)
        ) {
          extractedProducts = result.data;
        }

        console.log(
          "Home extracted products:",
          extractedProducts
        );

        setProducts(extractedProducts);
      } catch (err) {
        console.error(
          "Home products error:",
          err
        );

        setError(
          "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const bestSellers = products
    .filter(
      (product) => product.isBestSeller
    )
    .slice(0, 4);

  const newArrivals = products
    .filter(
      (product) => product.newArrival
    )
    .slice(0, 4);

  const featuredProducts =
    bestSellers.length > 0
      ? bestSellers
      : products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[72vh] bg-black text-white flex items-center overflow-hidden">

        {/* Background image */}

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2000&q=90)",
          }}
        />

        {/* Dark overlay */}

        <div className="absolute inset-0 bg-black/65" />

        {/* Gradient */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />

        <div className="relative max-w-7xl mx-auto w-full px-6 py-24">

          <div className="max-w-2xl">

            <p className="text-white uppercase tracking-[0.35em] text-sm font-semibold mb-5">
              StyleHub
            </p>

            <h1 className="text-5xl md:text-7xl font-semibold leading-tight">
              Style that
              <br />
              speaks for you.
            </h1>

            <p className="text-gray-300 text-lg mt-6 max-w-xl leading-8">
              Discover premium fashion,
              timeless essentials, and modern
              styles designed for every occasion.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">

              <Link
                to="/products"
                className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Shop Now
              </Link>

              <Link
                to="/products?category=new"
                className="border border-white/60 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition"
              >
                New Arrivals
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-12">

          <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-semibold">
            Explore
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold mt-3 text-black">
            Shop by Category
          </h2>

          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Find your perfect style from our
            carefully selected collections.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {categories.map(
            (category) => (
              <Link
                key={category.name}
                to={category.link}
                className="group relative h-[430px] rounded-2xl overflow-hidden bg-gray-200 shadow-sm hover:shadow-xl transition-all duration-500"
              >

                {/* IMAGE */}

                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* DARK GRADIENT */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                {/* HOVER OVERLAY */}

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

                {/* CONTENT */}

                <div className="absolute bottom-0 left-0 right-0 p-7 text-white">

                  <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">
                    Collection
                  </p>

                  <h3 className="text-3xl font-semibold">
                    {category.name}
                  </h3>

                  <p className="text-sm text-white/80 mt-2">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
                    Shop Collection
                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </div>

                </div>

              </Link>
            )
          )}

        </div>

      </section>

      {/* =====================================================
          BEST SELLERS
      ===================================================== */}

      <section className="bg-gray-50 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-end justify-between mb-10">

            <div>

              <p className="text-gray-500 uppercase tracking-[0.25em] text-xs font-semibold">
                Customer Favorites
              </p>

              <h2 className="text-4xl font-semibold mt-2 text-black">
                Best Sellers
              </h2>

            </div>

            <Link
              to="/products"
              className="hidden sm:block text-sm font-semibold text-black hover:underline"
            >
              View All →
            </Link>

          </div>

          {loading && (
            <div className="text-center py-10">
              Loading products...
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-500">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            featuredProducts.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No products available.
              </div>
            )}

          {!loading &&
            !error &&
            featuredProducts.length > 0 && (

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                {featuredProducts.map(
                  (product) => (

                    <ProductCard
                      key={String(
                        (
                          product as Product & {
                            _id?: string;
                          }
                        )._id ??
                          product.id
                      )}
                      product={product}
                    />

                  )
                )}

              </div>

            )}

        </div>

      </section>

      {/* =====================================================
          NEW ARRIVALS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="flex items-end justify-between mb-10">

          <div>

            <p className="text-gray-500 uppercase tracking-[0.25em] text-xs font-semibold">
              Just In
            </p>

            <h2 className="text-4xl font-semibold mt-2 text-black">
              New Arrivals
            </h2>

          </div>

          <Link
            to="/products"
            className="hidden sm:block text-sm font-semibold text-black hover:underline"
          >
            View All →
          </Link>

        </div>

        {!loading &&
          newArrivals.length > 0 && (

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

              {newArrivals.map(
                (product) => (

                  <ProductCard
                    key={String(
                      (
                        product as Product & {
                          _id?: string;
                        }
                      )._id ??
                        product.id
                    )}
                    product={product}
                  />

                )
              )}

            </div>

          )}

        {!loading &&
          newArrivals.length === 0 && (
            <p className="text-gray-500">
              No new arrivals available.
            </p>
          )}

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="relative bg-black text-white overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85)",
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">

          <p className="text-white/70 uppercase tracking-[0.3em] text-xs font-semibold">
            StyleHub
          </p>

          <h2 className="text-4xl md:text-6xl font-semibold mt-4">
            Find your next
            <br />
            favorite look.
          </h2>

          <p className="text-gray-300 mt-5 max-w-xl mx-auto">
            Explore our complete collection
            and discover pieces made to become
            part of your everyday style.
          </p>

          <Link
            to="/products"
            className="inline-block mt-9 bg-white text-black px-9 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Explore Collection
          </Link>

        </div>

      </section>

    </div>
  );
}