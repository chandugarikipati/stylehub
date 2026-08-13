import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    cartCount,
    removeFromCart,
    updateCartQty,
    clearCart,
  } = useApp();

  const shipping = cartTotal >= 3000 || cartTotal === 0
    ? 0
    : 99;

  const grandTotal = cartTotal + shipping;

  /* EMPTY CART */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">

          <div className="text-6xl mb-6">
            🛒
          </div>

          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Your cart is empty
          </h1>

          <p className="text-charcoal-400 mt-2 mb-8">
            Looks like you haven't added anything yet.
          </p>

          <Link
            to="/products"
            className="inline-block bg-charcoal text-white px-8 py-3 rounded-xl hover:bg-gold hover:text-charcoal transition-colors"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">

        <div>
          <h1 className="font-display text-3xl font-semibold">
            Shopping Cart
          </h1>

          <p className="text-sm text-charcoal-400 mt-1">
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Clear Cart
        </button>

      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">

        {/* CART ITEMS */}
        <div className="space-y-5">

          {cartItems.map((item) => {

            const itemTotal =
              Number(item.product.price || 0) *
              Number(item.qty || 0);

            return (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="border border-charcoal-100 rounded-2xl p-4 flex gap-5"
              >

                {/* IMAGE */}
                <Link
                  to={`/products/${item.productId}`}
                  className="w-28 h-36 shrink-0 overflow-hidden rounded-xl bg-charcoal-50"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* INFO */}
                <div className="flex-1">

                  <div className="flex justify-between gap-4">

                    <div>

                      <p className="text-xs text-charcoal-400 uppercase tracking-wider">
                        {item.product.brand}
                      </p>

                      <Link
                        to={`/products/${item.productId}`}
                        className="font-semibold text-charcoal hover:text-gold"
                      >
                        {item.product.name}
                      </Link>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(
                          item.productId,
                          item.size,
                          item.color
                        )
                      }
                      className="text-charcoal-400 hover:text-red-500"
                    >
                      ✕
                    </button>

                  </div>

                  {/* OPTIONS */}
                  <div className="flex gap-4 mt-3 text-sm text-charcoal-500">
                    <span>
                      Size: {item.size}
                    </span>

                    <span>
                      Color: {item.color}
                    </span>
                  </div>

                  {/* BOTTOM */}
                  <div className="flex items-center justify-between mt-5">

                    {/* QUANTITY */}
                    <div className="flex items-center border border-charcoal-200 rounded-lg">

                      <button
                        type="button"
                        onClick={() =>
                          updateCartQty(
                            item.productId,
                            item.size,
                            item.color,
                            item.qty - 1
                          )
                        }
                        className="w-9 h-9"
                      >
                        −
                      </button>

                      <span className="w-9 text-center text-sm">
                        {item.qty}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateCartQty(
                            item.productId,
                            item.size,
                            item.color,
                            item.qty + 1
                          )
                        }
                        className="w-9 h-9"
                      >
                        +
                      </button>

                    </div>

                    {/* PRICE */}
                    <span className="font-semibold">
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </span>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* ORDER SUMMARY */}
        <div className="border border-charcoal-100 rounded-2xl p-6 h-fit sticky top-28">

          <h2 className="font-display text-xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between">
              <span className="text-charcoal-500">
                Subtotal
              </span>

              <span>
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-charcoal-500">
                Shipping
              </span>

              <span>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}
              </span>
            </div>

            <div className="border-t border-charcoal-100 pt-4 flex justify-between font-semibold text-base">
              <span>
                Total
              </span>

              <span>
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>

          </div>

          {/* CHECKOUT BUTTON */}
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="w-full mt-7 bg-charcoal text-white py-4 rounded-xl font-semibold uppercase tracking-wider hover:bg-gold hover:text-charcoal transition-colors"
          >
            Proceed to Checkout
          </button>

          <Link
            to="/products"
            className="block text-center text-sm text-charcoal-500 hover:text-charcoal mt-5"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

