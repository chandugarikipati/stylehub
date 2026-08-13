import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import type { Product } from "../data/products";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

type MongoProduct = Product & {
  _id?: string;
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useApp();

  const [product, setProduct] =
    useState<MongoProduct | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  // =====================================================
  // LOAD PRODUCT
  // =====================================================

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log(
          "🔎 Loading product:",
          id
        );

        const response = await fetch(
          `${API_URL}/products/${id}`
        );

        const data = await response.json();

        console.log(
          "📦 Product API response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Product not found"
          );
        }

        /*
         * IMPORTANT:
         *
         * Backend returns:
         *
         * {
         *   success: true,
         *   product: {...}
         * }
         *
         * Therefore we MUST extract data.product.
         */

        const actualProduct =
          data?.product ?? data;

        if (
          !actualProduct ||
          typeof actualProduct !== "object"
        ) {
          throw new Error(
            "Invalid product response."
          );
        }

        console.log(
          "✅ Actual product:",
          actualProduct
        );

        setProduct(
          actualProduct as MongoProduct
        );

        // -------------------------------------------------
        // DEFAULT SIZE
        // -------------------------------------------------

        if (
          Array.isArray(
            actualProduct.sizes
          ) &&
          actualProduct.sizes.length > 0
        ) {
          setSelectedSize(
            actualProduct.sizes[0]
          );
        } else {
          setSelectedSize("One Size");
        }

        // -------------------------------------------------
        // DEFAULT COLOR
        // -------------------------------------------------

        if (
          Array.isArray(
            actualProduct.colors
          ) &&
          actualProduct.colors.length > 0
        ) {
          setSelectedColor(
            actualProduct.colors[0]
          );
        } else {
          setSelectedColor("Default");
        }
      } catch (err) {
        console.error(
          "❌ Product fetch error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-charcoal rounded-full animate-spin mx-auto mb-4" />

          <p className="text-charcoal">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-5">
          🛍️
        </div>

        <h1 className="text-2xl font-semibold mb-3">
          Product not found
        </h1>

        <p className="text-gray-500 mb-6 max-w-md">
          {error ||
            "This product could not be found."}
        </p>

        <Link
          to="/products"
          className="bg-charcoal text-white px-7 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  // =====================================================
  // PRODUCT ID
  // =====================================================

  const productId = String(
    product._id ??
      product.id ??
      ""
  );

  // =====================================================
  // STOCK
  // =====================================================

  const stockCount = Number(
    product.stockCount ?? 0
  );

  const inStock =
    product.inStock !== false &&
    stockCount > 0;

  // =====================================================
  // PRICE
  // =====================================================

  const price = Number(
    product.price ?? 0
  );

  const originalPrice = Number(
    product.originalPrice ?? 0
  );

  const discount = Number(
    product.discount ?? 0
  );

  // =====================================================
  // WISHLIST
  // =====================================================

  const wishlisted =
    isWishlisted(productId);

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = () => {
    if (!productId) {
      alert("Product ID is missing.");
      return;
    }

    if (!inStock) {
      alert(
        "Sorry, this product is currently out of stock."
      );
      return;
    }

    if (
      product.sizes &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      alert("Please select a size.");
      return;
    }

    if (
      product.colors &&
      product.colors.length > 0 &&
      !selectedColor
    ) {
      alert("Please select a color.");
      return;
    }

    const finalSize =
      selectedSize ||
      "One Size";

    const finalColor =
      selectedColor ||
      "Default";

    const safeQuantity =
      Math.min(
        quantity,
        stockCount
      );

    addToCart(
      {
        ...product,
        id: productId,
      },
      finalSize,
      finalColor,
      safeQuantity
    );
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = () => {
    if (!productId) {
      alert("Product ID is missing.");
      return;
    }

    if (!inStock) {
      alert(
        "Sorry, this product is currently out of stock."
      );
      return;
    }

    if (
      product.sizes &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      alert("Please select a size.");
      return;
    }

    if (
      product.colors &&
      product.colors.length > 0 &&
      !selectedColor
    ) {
      alert("Please select a color.");
      return;
    }

    const finalSize =
      selectedSize ||
      "One Size";

    const finalColor =
      selectedColor ||
      "Default";

    addToCart(
      {
        ...product,
        id: productId,
      },
      finalSize,
      finalColor,
      Math.min(quantity, stockCount)
    );

    navigate("/checkout");
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const imageUrl =
    product.image ||
    (product.images &&
    product.images.length > 0
      ? product.images[0]
      : "");

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-8 flex-wrap">

        <Link
          to="/"
          className="hover:text-charcoal"
        >
          Home
        </Link>

        <span>/</span>

        <Link
          to="/products"
          className="hover:text-charcoal"
        >
          Products
        </Link>

        <span>/</span>

        <span className="text-charcoal">
          {product.name}
        </span>

      </div>

      {/* =================================================
          PRODUCT
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* =================================================
            IMAGE
        ================================================= */}

        <div className="relative">

          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}

          </div>

          {/* DISCOUNT */}

          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg">
              -{discount}%
            </span>
          )}

          {/* STOCK */}

          <div className="absolute top-4 right-4">

            {inStock ? (
              <span className="bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-lg">
                In Stock
              </span>
            ) : (
              <span className="bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg">
                Out of Stock
              </span>
            )}

          </div>

        </div>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <div className="flex flex-col justify-center">

          {/* BRAND */}

          <p className="text-xs uppercase tracking-widest text-charcoal-400 mb-2">
            {product.brand}
          </p>

          {/* NAME */}

          <h1 className="text-3xl sm:text-4xl font-semibold text-charcoal">
            {product.name}
          </h1>

          {/* RATING */}

          <div className="flex items-center gap-2 mt-4">

            <div className="flex">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <span
                    key={star}
                    className={
                      star <=
                      Math.round(
                        Number(
                          product.rating ?? 0
                        )
                      )
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                )
              )}

            </div>

            <span className="text-sm text-charcoal-400">
              (
              {Number(
                product.reviewCount ?? 0
              ).toLocaleString(
                "en-IN"
              )}{" "}
              reviews)
            </span>

          </div>

          {/* PRICE */}

          <div className="flex items-center gap-3 mt-6">

            <span className="text-3xl font-bold text-charcoal">
              ₹
              {price.toLocaleString(
                "en-IN"
              )}
            </span>

            {originalPrice > price && (
              <span className="text-lg text-charcoal-400 line-through">
                ₹
                {originalPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            )}

          </div>

          {/* STOCK INFORMATION */}

          <div className="mt-3">

            {inStock ? (
              <div className="flex items-center gap-2">

                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />

                <span className="text-sm text-green-700 font-medium">
                  In Stock
                </span>

                {stockCount > 0 &&
                  stockCount <= 10 && (
                    <span className="text-sm text-orange-600">
                      Only {stockCount} left
                    </span>
                  )}

              </div>
            ) : (
              <div className="flex items-center gap-2">

                <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />

                <span className="text-sm text-red-600 font-medium">
                  Out of Stock
                </span>

              </div>
            )}

          </div>

          {/* DESCRIPTION */}

          <p className="text-charcoal-500 leading-relaxed mt-6">
            {product.description ||
              "Premium quality fashion designed for modern lifestyles."}
          </p>

          {/* MATERIAL */}

          {product.material && (
            <div className="mt-5 text-sm">
              <span className="font-semibold">
                Material:
              </span>{" "}
              <span className="text-gray-500">
                {product.material}
              </span>
            </div>
          )}

          {/* FIT */}

          {product.fit && (
            <div className="mt-2 text-sm">
              <span className="font-semibold">
                Fit:
              </span>{" "}
              <span className="text-gray-500">
                {product.fit}
              </span>
            </div>
          )}

          {/* =================================================
              SIZE
          ================================================= */}

          {product.sizes &&
            product.sizes.length > 0 && (
              <div className="mt-8">

                <h3 className="text-sm font-semibold mb-3">
                  Select Size
                </h3>

                <div className="flex flex-wrap gap-2">

                  {product.sizes.map(
                    (size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          setSelectedSize(
                            size
                          )
                        }
                        disabled={!inStock}
                        className={`px-5 py-2.5 border rounded-lg text-sm transition ${
                          selectedSize ===
                          size
                            ? "bg-charcoal text-white border-charcoal"
                            : "border-gray-300 hover:border-charcoal"
                        } disabled:opacity-50`}
                      >
                        {size}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

          {/* =================================================
              COLOR
          ================================================= */}

          {product.colors &&
            product.colors.length > 0 && (
              <div className="mt-6">

                <h3 className="text-sm font-semibold mb-3">
                  Select Color
                </h3>

                <div className="flex flex-wrap gap-2">

                  {product.colors.map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setSelectedColor(
                            color
                          )
                        }
                        disabled={!inStock}
                        className={`px-5 py-2.5 border rounded-lg text-sm transition ${
                          selectedColor ===
                          color
                            ? "bg-charcoal text-white border-charcoal"
                            : "border-gray-300 hover:border-charcoal"
                        } disabled:opacity-50`}
                      >
                        {color}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

          {/* =================================================
              QUANTITY
          ================================================= */}

          <div className="flex items-center gap-4 mt-8">

            <span className="text-sm font-semibold">
              Quantity
            </span>

            <div className="flex items-center border border-gray-300 rounded-lg">

              <button
                type="button"
                disabled={!inStock}
                onClick={() =>
                  setQuantity(
                    (q) =>
                      Math.max(
                        1,
                        q - 1
                      )
                  )
                }
                className="w-10 h-10 hover:bg-gray-100 disabled:opacity-50"
              >
                −
              </button>

              <span className="w-10 text-center">
                {quantity}
              </span>

              <button
                type="button"
                disabled={!inStock}
                onClick={() =>
                  setQuantity(
                    (q) =>
                      Math.min(
                        stockCount ||
                          q + 1,
                        q + 1
                      )
                  )
                }
                className="w-10 h-10 hover:bg-gray-100 disabled:opacity-50"
              >
                +
              </button>

            </div>

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex gap-3 mt-8">

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 bg-charcoal text-white py-4 rounded-xl font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {inStock
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

            <button
              type="button"
              onClick={() =>
                toggleWishlist(
                  productId
                )
              }
              className="w-14 h-14 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-100"
              aria-label="Wishlist"
            >
              <span
                className={
                  wishlisted
                    ? "text-yellow-500 text-xl"
                    : "text-charcoal text-xl"
                }
              >
                {wishlisted
                  ? "♥"
                  : "♡"}
              </span>
            </button>

          </div>

          {/* BUY NOW */}

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!inStock}
            className="w-full mt-3 border-2 border-charcoal text-charcoal py-4 rounded-xl font-semibold uppercase tracking-wider hover:bg-charcoal hover:text-white transition disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>

          {/* CONTINUE */}

          <Link
            to="/products"
            className="text-center mt-5 text-sm text-gray-500 hover:text-charcoal"
          >
            ← Continue Shopping
          </Link>

        </div>
      </div>
    </div>
  );
}