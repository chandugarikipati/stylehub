import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import type { Product } from "../data/products";

import { useApp } from "../context/AppContext";

type Review = {
  _id?: string;
  id?: string;
  userName?: string;
  name?: string;
  rating?: number;
  comment?: string;
  text?: string;
  createdAt?: string;
};

type ProductWithMongoId = Product & {
  _id?: string;

  reviews?: Review[];

  category?: string;
  subcategory?: string;
  gender?: string;
  sku?: string;
  careInstructions?: string;
  occasion?: string;
  countryOfOrigin?: string;
};

export default function ProductDetailsTemp() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [product, setProduct] =
    useState<ProductWithMongoId | null>(null);

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

  const [selectedImage, setSelectedImage] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<"about" | "reviews">("about");

  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    user,
    showToast,
  } = useApp();

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          setError("Product ID is missing.");
          return;
        }

        console.log("Fetching product:", id);

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        console.log(
          "Response status:",
          response.status
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        console.log(
          "Product received:",
          data
        );

        let receivedProduct: ProductWithMongoId;

        if (
          data &&
          typeof data === "object" &&
          "product" in data &&
          data.product
        ) {
          receivedProduct = data.product;
        } else {
          receivedProduct = data;
        }

        if (!receivedProduct) {
          throw new Error(
            "Product data is empty"
          );
        }

        setProduct(receivedProduct);

        // DEFAULT SIZE

        if (
          receivedProduct.sizes &&
          receivedProduct.sizes.length > 0
        ) {
          setSelectedSize(
            receivedProduct.sizes[0]
          );
        }

        // DEFAULT COLOR

        if (
          receivedProduct.colors &&
          receivedProduct.colors.length > 0
        ) {
          setSelectedColor(
            receivedProduct.colors[0]
          );
        }

        // DEFAULT IMAGE

        const images =
          receivedProduct.images &&
          receivedProduct.images.length > 0
            ? receivedProduct.images
            : receivedProduct.image
            ? [receivedProduct.image]
            : [];

        setSelectedImage(
          images[0] || ""
        );
      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        setError(
          "Unable to load this product. Please check that the backend is running."
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
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-5" />

          <p className="text-gray-500">
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
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-5">
            🛍️
          </div>

          <h1 className="text-3xl font-semibold mb-3">
            Product not found
          </h1>

          <p className="text-gray-500 mb-7">
            {error ||
              "This product could not be found."}
          </p>

          <Link
            to="/products"
            className="inline-block bg-black text-white px-7 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Back to Products
          </Link>
        </div>
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
  // IMAGES
  // =====================================================

  const productImages =
    product.images &&
    product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  // =====================================================
  // STOCK
  // =====================================================

  const isInStock =
    Boolean(product.inStock);

  const stockCount =
    Number(
      product.stockCount || 0
    );

  // =====================================================
  // FAVORITE
  // =====================================================

  const favorite =
    productId
      ? isWishlisted(productId)
      : false;

  // =====================================================
  // PRICE
  // =====================================================

  const price =
    Number(product.price || 0);

  const originalPrice =
    Number(
      product.originalPrice || 0
    );

  const discount =
    Number(
      product.discount || 0
    );

  // =====================================================
  // REVIEWS
  // =====================================================

  const reviews =
    Array.isArray(product.reviews)
      ? product.reviews
      : [];

  const productRating =
    Number(product.rating || 0);

  const reviewCount =
    Number(
      product.reviewCount ||
        reviews.length ||
        0
    );

  const getReviewName = (
    review: Review
  ) => {
    return (
      review.userName ||
      review.name ||
      "StyleHub Customer"
    );
  };

  const getReviewText = (
    review: Review
  ) => {
    return (
      review.comment ||
      review.text ||
      "Great product!"
    );
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = () => {
    if (!user) {
      showToast(
        "Please login to add items to your cart.",
        "error"
      );

      navigate("/login");

      return;
    }

    if (!productId) {
      showToast(
        "Product ID is missing.",
        "error"
      );

      return;
    }

    if (!isInStock) {
      showToast(
        "This product is currently out of stock.",
        "error"
      );

      return;
    }

    if (
      product.sizes &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      showToast(
        "Please select a size.",
        "error"
      );

      return;
    }

    if (
      product.colors &&
      product.colors.length > 0 &&
      !selectedColor
    ) {
      showToast(
        "Please select a color.",
        "error"
      );

      return;
    }

    const success =
      addToCart(
        {
          ...product,
          id: productId,
        },
        selectedSize ||
          product.sizes?.[0] ||
          "",
        selectedColor ||
          product.colors?.[0] ||
          "",
        quantity
      );

    if (success) {
      showToast(
        "Product added to cart.",
        "success"
      );
    }
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = () => {
    if (!user) {
      showToast(
        "Please login or create an account before buying.",
        "error"
      );

      navigate("/login");

      return;
    }

    if (!productId) {
      showToast(
        "Product ID is missing.",
        "error"
      );

      return;
    }

    if (!isInStock) {
      showToast(
        "This product is currently out of stock.",
        "error"
      );

      return;
    }

    if (
      product.sizes &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      showToast(
        "Please select a size.",
        "error"
      );

      return;
    }

    if (
      product.colors &&
      product.colors.length > 0 &&
      !selectedColor
    ) {
      showToast(
        "Please select a color.",
        "error"
      );

      return;
    }

    const success =
      addToCart(
        {
          ...product,
          id: productId,
        },
        selectedSize ||
          product.sizes?.[0] ||
          "",
        selectedColor ||
          product.colors?.[0] ||
          "",
        quantity
      );

    if (success) {
      navigate("/checkout");
    }
  };

  // =====================================================
  // FAVORITE
  // =====================================================

  const handleFavorite = () => {
    if (!user) {
      showToast(
        "Please login to add items to your favorites.",
        "error"
      );

      navigate("/login");

      return;
    }

    if (!productId) {
      showToast(
        "Product ID is missing.",
        "error"
      );

      return;
    }

    toggleWishlist(productId);
  };

  // =====================================================
  // QUANTITY
  // =====================================================

  const decreaseQuantity = () => {
    setQuantity(
      (current) =>
        Math.max(
          1,
          current - 1
        )
    );
  };

  const increaseQuantity = () => {
    if (
      stockCount > 0 &&
      quantity >= stockCount
    ) {
      showToast(
        `Only ${stockCount} items available.`,
        "info"
      );

      return;
    }

    setQuantity(
      (current) =>
        current + 1
    );
  };

  // =====================================================
  // MAIN IMAGE
  // =====================================================

  const mainImage =
    selectedImage ||
    product.image ||
    productImages[0] ||
    "";

  // =====================================================
  // RATING STARS
  // =====================================================

  const renderStars = (
    rating: number
  ) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <span
              key={star}
              className={
                star <=
                Math.round(rating)
                  ? "text-yellow-500"
                  : "text-gray-200"
              }
            >
              ★
            </span>
          )
        )}
      </div>
    );
  };

  // =====================================================
  // REVIEW BREAKDOWN
  // =====================================================

  const getRatingPercentage = (
    star: number
  ) => {
    if (
      reviews.length === 0
    ) {
      return star ===
        Math.round(productRating)
        ? 100
        : 0;
    }

    const count =
      reviews.filter(
        (review) =>
          Math.round(
            Number(
              review.rating || 0
            )
          ) === star
      ).length;

    return Math.round(
      (count / reviews.length) *
        100
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-8">

        <Link
          to="/"
          className="hover:text-black transition"
        >
          Home
        </Link>

        <span>/</span>

        <Link
          to="/products"
          className="hover:text-black transition"
        >
          Products
        </Link>

        <span>/</span>

        <span className="text-gray-700 line-clamp-1">
          {product.name}
        </span>

      </div>

      {/* =================================================
          PRODUCT
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* =================================================
            LEFT IMAGE SECTION
        ================================================= */}

        <div>

          <div className="relative overflow-hidden rounded-3xl bg-gray-100">

            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full aspect-[3/4] object-cover"
              />
            ) : (
              <div className="w-full aspect-[3/4] flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}

            {discount > 0 && (
              <span className="absolute top-5 left-5 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg">
                {discount}% OFF
              </span>
            )}

            <button
              type="button"
              onClick={
                handleFavorite
              }
              aria-label={
                favorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
            >
              <span
                className={`text-2xl ${
                  favorite
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                {favorite
                  ? "♥"
                  : "♡"}
              </span>
            </button>

          </div>

          {/* THUMBNAILS */}

          {productImages.length >
            1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">

              {productImages.map(
                (
                  image,
                  index
                ) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                    className={`overflow-hidden rounded-xl bg-gray-100 border-2 ${
                      selectedImage ===
                      image
                        ? "border-black"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                )
              )}

            </div>
          )}

        </div>

        {/* =================================================
            RIGHT INFORMATION
        ================================================= */}

        <div>

          {product.brand && (
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold">
              {product.brand}
            </p>
          )}

          <h1 className="text-3xl md:text-4xl font-semibold mt-2 text-gray-900">
            {product.name}
          </h1>

          {/* RATING */}

          <div className="flex items-center gap-3 mt-4">

            {renderStars(
              productRating
            )}

            <span className="font-medium">
              {productRating.toFixed(1)}
            </span>

            <span className="text-gray-400">
              ({reviewCount} reviews)
            </span>

          </div>

          {/* PRICE */}

          <div className="flex flex-wrap items-center gap-3 mt-6">

            <span className="text-3xl font-bold">
              ₹
              {price.toLocaleString(
                "en-IN"
              )}
            </span>

            {originalPrice >
              price && (
              <span className="text-lg text-gray-400 line-through">
                ₹
                {originalPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            )}

            {discount > 0 && (
              <span className="text-sm font-bold text-green-600">
                {discount}% OFF
              </span>
            )}

          </div>

          {/* SHORT DESCRIPTION */}

          {product.description && (
            <p className="text-gray-600 leading-7 mt-6">
              {product.description}
            </p>
          )}

          {/* SIZE */}

          {product.sizes &&
            product.sizes.length >
              0 && (
              <div className="mt-8">

                <h3 className="font-semibold mb-3">
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
                        className={`min-w-[52px] px-5 py-3 border rounded-xl font-medium ${
                          selectedSize ===
                          size
                            ? "bg-black text-white border-black"
                            : "border-gray-300 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

          {/* COLOR */}

          {product.colors &&
            product.colors.length >
              0 && (
              <div className="mt-8">

                <h3 className="font-semibold mb-3">
                  Color
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
                        className={`px-5 py-3 border rounded-xl font-medium ${
                          selectedColor ===
                          color
                            ? "bg-black text-white border-black"
                            : "border-gray-300 hover:border-black"
                        }`}
                      >
                        {color}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

          {/* QUANTITY */}

          <div className="mt-8">

            <h3 className="font-semibold mb-3">
              Quantity
            </h3>

            <div className="flex items-center border border-gray-300 rounded-xl w-fit overflow-hidden">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
                className="px-5 py-3 hover:bg-gray-100 disabled:opacity-40"
              >
                −
              </button>

              <span className="px-7 py-3 border-x border-gray-300 font-medium">
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  !isInStock
                }
                className="px-5 py-3 hover:bg-gray-100 disabled:opacity-40"
              >
                +
              </button>

            </div>

          </div>

          {/* STOCK */}

          <div className="mt-6">

            {isInStock ? (
              <p className="text-sm text-green-600 font-medium">
                ✓ In stock
                {stockCount > 0
                  ? ` • ${stockCount} available`
                  : ""}
              </p>
            ) : (
              <p className="text-sm text-red-600 font-medium">
                ✕ Out of stock
              </p>
            )}

          </div>

          {/* ACTION BUTTONS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              disabled={
                !isInStock
              }
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {!isInStock
                ? "Out of Stock"
                : user
                ? "Add to Cart"
                : "Login to Add"}
            </button>

            <button
              type="button"
              onClick={
                handleBuyNow
              }
              disabled={
                !isInStock
              }
              className="w-full border-2 border-black text-black py-4 rounded-xl font-semibold hover:bg-black hover:text-white transition disabled:border-gray-300 disabled:text-gray-400"
            >
              {!isInStock
                ? "Unavailable"
                : user
                ? "Buy Now"
                : "Login to Buy"}
            </button>

          </div>

          {/* LOGIN MESSAGE */}

          {!user && (
            <div className="mt-5 rounded-xl bg-gray-50 border border-gray-200 p-4">

              <p className="text-sm font-semibold">
                Want to buy this?
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Login to add products
                to your cart and
                favorites.
              </p>

              <div className="flex gap-3 mt-3">

                <Link
                  to="/login"
                  className="text-xs font-semibold underline"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="text-xs font-semibold underline"
                >
                  Create Account
                </Link>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          ABOUT / REVIEWS SECTION
      ===================================================== */}

      <div className="mt-16 border-t border-gray-200 pt-10">

        {/* TABS */}

        <div className="flex items-center gap-8 border-b border-gray-200">

          <button
            type="button"
            onClick={() =>
              setActiveTab("about")
            }
            className={`pb-4 font-semibold transition ${
              activeTab === "about"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            About Product
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("reviews")
            }
            className={`pb-4 font-semibold transition ${
              activeTab === "reviews"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            Reviews ({reviewCount})
          </button>

        </div>

        {/* =================================================
            ABOUT PRODUCT
        ================================================= */}

        {activeTab === "about" && (
          <div className="py-10">

            <h2 className="text-2xl font-semibold mb-6">
              About This Product
            </h2>

            {product.description && (
              <p className="text-gray-600 leading-8 max-w-4xl mb-8">
                {product.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {product.brand && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Brand
                  </p>

                  <p className="font-semibold mt-2">
                    {product.brand}
                  </p>
                </div>
              )}

              {product.category && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Category
                  </p>

                  <p className="font-semibold mt-2">
                    {product.category}
                  </p>
                </div>
              )}

              {product.material && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Material
                  </p>

                  <p className="font-semibold mt-2">
                    {product.material}
                  </p>
                </div>
              )}

              {product.fit && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Fit
                  </p>

                  <p className="font-semibold mt-2">
                    {product.fit}
                  </p>
                </div>
              )}

              {product.gender && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Gender
                  </p>

                  <p className="font-semibold mt-2">
                    {product.gender}
                  </p>
                </div>
              )}

              {product.occasion && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Occasion
                  </p>

                  <p className="font-semibold mt-2">
                    {product.occasion}
                  </p>
                </div>
              )}

              {product.careInstructions && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Care Instructions
                  </p>

                  <p className="font-semibold mt-2">
                    {product.careInstructions}
                  </p>
                </div>
              )}

              {product.countryOfOrigin && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Country of Origin
                  </p>

                  <p className="font-semibold mt-2">
                    {product.countryOfOrigin}
                  </p>
                </div>
              )}

            </div>

            {/* AVAILABLE OPTIONS */}

            <div className="mt-10">

              <h3 className="text-xl font-semibold mb-5">
                Available Options
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {product.sizes &&
                  product.sizes.length >
                    0 && (
                    <div>
                      <p className="font-medium mb-3">
                        Available Sizes
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {product.sizes.map(
                          (size) => (
                            <span
                              key={size}
                              className="px-4 py-2 bg-gray-100 rounded-lg text-sm"
                            >
                              {size}
                            </span>
                          )
                        )}

                      </div>
                    </div>
                  )}

                {product.colors &&
                  product.colors.length >
                    0 && (
                    <div>
                      <p className="font-medium mb-3">
                        Available Colors
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {product.colors.map(
                          (color) => (
                            <span
                              key={color}
                              className="px-4 py-2 bg-gray-100 rounded-lg text-sm"
                            >
                              {color}
                            </span>
                          )
                        )}

                      </div>
                    </div>
                  )}

              </div>

            </div>

            {/* BENEFITS */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">

              <div className="rounded-2xl border border-gray-200 p-6">
                <div className="text-2xl mb-3">
                  🚚
                </div>

                <h3 className="font-semibold">
                  Fast Delivery
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Quick and reliable
                  delivery.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6">
                <div className="text-2xl mb-3">
                  ↩️
                </div>

                <h3 className="font-semibold">
                  Easy Returns
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Hassle-free returns.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6">
                <div className="text-2xl mb-3">
                  🔒
                </div>

                <h3 className="font-semibold">
                  Secure Payment
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Safe and secure
                  checkout.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* =================================================
            REVIEWS
        ================================================= */}

        {activeTab === "reviews" && (
          <div className="py-10">

            <h2 className="text-2xl font-semibold mb-8">
              Customer Reviews
            </h2>

            {/* REVIEW SUMMARY */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

              <div className="bg-gray-50 rounded-2xl p-7 text-center">

                <p className="text-5xl font-bold">
                  {productRating.toFixed(
                    1
                  )}
                </p>

                <div className="flex justify-center mt-3">
                  {renderStars(
                    productRating
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-3">
                  Based on{" "}
                  {reviewCount}{" "}
                  reviews
                </p>

              </div>

              <div className="md:col-span-2 space-y-3">

                {[5, 4, 3, 2, 1].map(
                  (star) => (
                    <div
                      key={star}
                      className="flex items-center gap-3"
                    >

                      <span className="w-8 text-sm">
                        {star} ★
                      </span>

                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{
                            width: `${getRatingPercentage(
                              star
                            )}%`,
                          }}
                        />

                      </div>

                      <span className="w-10 text-xs text-gray-400">
                        {getRatingPercentage(
                          star
                        )}%
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* REVIEW LIST */}

            {reviews.length > 0 ? (
              <div className="space-y-5">

                {reviews.map(
                  (
                    review,
                    index
                  ) => (
                    <div
                      key={
                        review._id ||
                        review.id ||
                        index
                      }
                      className="border border-gray-200 rounded-2xl p-6"
                    >

                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <div>

                          <p className="font-semibold">
                            {getReviewName(
                              review
                            )}
                          </p>

                          <div className="mt-1">
                            {renderStars(
                              Number(
                                review.rating ||
                                  0
                              )
                            )}
                          </div>

                        </div>

                        {review.createdAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(
                              review.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )}
                          </span>
                        )}

                      </div>

                      <p className="text-gray-600 leading-7 mt-4">
                        {getReviewText(
                          review
                        )}
                      </p>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="text-center border border-dashed border-gray-300 rounded-2xl py-14">

                <div className="text-4xl mb-4">
                  ⭐
                </div>

                <h3 className="text-lg font-semibold">
                  No reviews yet
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Be the first customer
                  to review this
                  product.
                </p>

              </div>
            )}

          </div>
        )}

      </div>

      {/* =================================================
          CONTINUE SHOPPING
      ================================================= */}

      <div className="text-center mt-12 pb-8">

        <Link
          to="/products"
          className="text-gray-500 hover:text-black transition"
        >
          ← Continue Shopping
        </Link>

      </div>

    </div>
  );
}