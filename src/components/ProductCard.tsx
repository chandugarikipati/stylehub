import { useNavigate } from "react-router-dom";
import type { Product } from "../data/products";
import { useApp } from "../context/AppContext";

interface ProductCardProps {
  product: Product;
}

type ProductWithMongoId = Product & {
  _id?: string;
  newArrival?: boolean;
  isBestSeller?: boolean;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const navigate = useNavigate();

  const {
    user,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useApp();

  const item =
    product as ProductWithMongoId;

  const productId = String(
    item._id ??
      item.id ??
      ""
  );

  const favorite =
    user && productId
      ? isWishlisted(productId)
      : false;

  // =====================================================
  // CLICK PRODUCT
  // =====================================================

  const handleProductClick = () => {
    // Logged out → Signup
    if (!user) {
      navigate("/register");
      return;
    }

    // Logged in → Product Details
    navigate(`/products/${productId}`);
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    // Logged out → Signup
    if (!user) {
      navigate("/register");
      return;
    }

    const size =
      product.sizes &&
      product.sizes.length > 0
        ? product.sizes[0]
        : "One Size";

    const color =
      product.colors &&
      product.colors.length > 0
        ? product.colors[0]
        : "Default";

    addToCart(
      {
        ...product,
        id: productId,
      },
      size,
      color,
      1
    );
  };

  // =====================================================
  // FAVORITE
  // =====================================================

  const handleFavorite = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    // Logged out → Signup
    if (!user) {
      navigate("/register");
      return;
    }

    if (!productId) {
      return;
    }

    toggleWishlist(productId);
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    // Logged out → Signup
    if (!user) {
      navigate("/register");
      return;
    }

    const size =
      product.sizes &&
      product.sizes.length > 0
        ? product.sizes[0]
        : "One Size";

    const color =
      product.colors &&
      product.colors.length > 0
        ? product.colors[0]
        : "Default";

    const success = addToCart(
      {
        ...product,
        id: productId,
      },
      size,
      color,
      1
    );

    if (success) {
      navigate("/checkout");
    }
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
  // PRICE
  // =====================================================

  const price = Number(
    product.price || 0
  );

  const originalPrice = Number(
    product.originalPrice || 0
  );

  const discount = Number(
    product.discount || 0
  );

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="group">

      {/* PRODUCT IMAGE */}

      <div
        onClick={
          handleProductClick
        }
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 cursor-pointer"
      >

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* NEW BADGE */}

        {item.newArrival && (
          <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wider rounded-md">
            New
          </span>
        )}

        {/* BESTSELLER BADGE */}

        {item.isBestSeller &&
          !item.newArrival && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-black text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wider rounded-md">
              Bestseller
            </span>
          )}

        {/* DISCOUNT */}

        {discount > 0 && (
          <span className="absolute top-3 right-12 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}

        {/* FAVORITE */}

        <button
          type="button"
          onClick={
            handleFavorite
          }
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Add to favorites"
        >
          <span
            className={
              favorite
                ? "text-red-500 text-lg"
                : "text-black text-lg"
            }
          >
            {favorite
              ? "♥"
              : "♡"}
          </span>
        </button>

      </div>

      {/* PRODUCT INFORMATION */}

      <div className="mt-3 px-0.5">

        {/* BRAND */}

        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
          {product.brand}
        </p>

        {/* PRODUCT NAME */}

        <button
          type="button"
          onClick={
            handleProductClick
          }
          className="block text-left w-full text-sm font-medium text-black hover:text-gray-600 transition-colors mt-0.5 leading-tight"
        >
          {product.name}
        </button>

        {/* PRICE */}

        <div className="flex items-center gap-2 mt-1.5">

          <span className="font-semibold text-black text-sm">
            ₹
            {price.toLocaleString(
              "en-IN"
            )}
          </span>

          {originalPrice >
            price && (
            <span className="text-xs text-gray-400 line-through">
              ₹
              {originalPrice.toLocaleString(
                "en-IN"
              )}
            </span>
          )}

        </div>

        {/* RATING */}

        <div className="flex items-center gap-1 mt-1">

          {[1, 2, 3, 4, 5].map(
            (star) => (
              <span
                key={star}
                className={
                  star <=
                  Math.round(
                    Number(
                      product.rating || 0
                    )
                  )
                    ? "text-yellow-400 text-xs"
                    : "text-gray-200 text-xs"
                }
              >
                ★
              </span>
            )
          )}

          <span className="text-[10px] text-gray-400 ml-0.5">
            (
            {product.reviewCount ||
              0}
            )
          </span>

        </div>

        {/* BUTTONS */}

        <div className="grid grid-cols-2 gap-2 mt-4">

          {/* ADD TO CART */}

          <button
            type="button"
            onClick={
              handleAddToCart
            }
            className="border border-black px-3 py-2.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors"
          >
            Add to Cart
          </button>

          {/* BUY NOW */}

          <button
            type="button"
            onClick={
              handleBuyNow
            }
            className="bg-black text-white px-3 py-2.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Buy Now
          </button>

        </div>

      </div>

    </div>
  );
}