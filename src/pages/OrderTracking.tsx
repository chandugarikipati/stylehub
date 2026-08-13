import {
  Link,
  useSearchParams,
} from "react-router-dom";

import { useMemo } from "react";

import {
  getOrderById,
} from "../utils/orderStorage";

import { products } from "../data/products";

export default function OrderTracking() {
  const [searchParams] =
    useSearchParams();

  const orderId =
    searchParams.get("orderId");

  const order = useMemo(() => {
    if (!orderId) {
      return undefined;
    }

    return getOrderById(orderId);
  }, [orderId]);

  // =====================================================
  // NO ORDER ID
  // =====================================================

  if (!orderId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">

        <div className="text-center max-w-md">

          <div className="text-5xl mb-5">
            📦
          </div>

          <h1 className="font-display text-3xl font-semibold text-charcoal">
            No Order Selected
          </h1>

          <p className="text-charcoal-400 mt-3">
            Select an order from your order history to track it.
          </p>

          <Link
            to="/dashboard"
            className="inline-block mt-7 bg-charcoal text-white px-8 py-3 rounded-xl"
          >
            View My Orders
          </Link>

        </div>

      </div>
    );
  }

  // =====================================================
  // ORDER NOT FOUND
  // =====================================================

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">

        <div className="text-center max-w-md">

          <div className="text-5xl mb-5">
            ❌
          </div>

          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Order Not Found
          </h1>

          <p className="text-charcoal-400 mt-3">
            We couldn't find order{" "}
            <strong>{orderId}</strong>.
          </p>

          <Link
            to="/dashboard"
            className="inline-block mt-7 bg-charcoal text-white px-8 py-3 rounded-xl"
          >
            Back to Orders
          </Link>

        </div>

      </div>
    );
  }

  // =====================================================
  // TRACKING PROGRESS
  // =====================================================

  const statusSteps = [
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStep =
    order.status === "Cancelled"
      ? -1
      : statusSteps.indexOf(
          order.status
        );

  return (
    <div className="pt-28 min-h-screen bg-charcoal-50">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* HEADER */}

        <div className="mb-8">

          <Link
            to="/dashboard"
            className="text-sm text-charcoal-500 hover:text-charcoal"
          >
            ← Back to Order History
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">

            <div>

              <h1 className="font-display text-3xl font-bold text-charcoal">
                Track Order
              </h1>

              <p className="text-sm text-charcoal-400 mt-2">
                Order ID:{" "}
                <span className="font-semibold text-charcoal">
                  {order.id}
                </span>
              </p>

            </div>

            <span
              className={`inline-flex w-fit text-sm font-medium px-4 py-2 rounded-full ${
                order.status ===
                "Delivered"
                  ? "bg-green-50 text-green-700"
                  : order.status ===
                    "Cancelled"
                  ? "bg-red-50 text-red-600"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {order.status}
            </span>

          </div>

        </div>

        {/* =====================================================
            TRACKING CARD
        ===================================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">

          <h2 className="font-display text-xl font-semibold mb-8">
            Delivery Status
          </h2>

          {order.status ===
          "Cancelled" ? (
            <div className="bg-red-50 rounded-xl p-5">

              <p className="font-semibold text-red-700">
                This order has been cancelled.
              </p>

            </div>
          ) : (
            <div>

              {statusSteps.map(
                (step, index) => {

                  const completed =
                    index <=
                    currentStep;

                  const isCurrent =
                    index ===
                    currentStep;

                  return (
                    <div
                      key={step}
                      className="flex items-start"
                    >

                      <div className="flex flex-col items-center mr-4">

                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            completed
                              ? "bg-charcoal text-white"
                              : "bg-charcoal-100 text-charcoal-400"
                          } ${
                            isCurrent
                              ? "ring-4 ring-gold/20"
                              : ""
                          }`}
                        >
                          {completed
                            ? "✓"
                            : index + 1}
                        </div>

                        {index <
                          statusSteps.length -
                            1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              index <
                              currentStep
                                ? "bg-charcoal"
                                : "bg-charcoal-100"
                            }`}
                          />
                        )}

                      </div>

                      <div className="pt-2">

                        <p
                          className={`font-semibold ${
                            completed
                              ? "text-charcoal"
                              : "text-charcoal-400"
                          }`}
                        >
                          {step}
                        </p>

                        <p className="text-xs text-charcoal-400 mt-1">

                          {step ===
                            "Processing" &&
                            "Your order has been received."}

                          {step ===
                            "Shipped" &&
                            "Your order is on its way."}

                          {step ===
                            "Out for Delivery" &&
                            "Your order is with the delivery partner."}

                          {step ===
                            "Delivered" &&
                            "Your order has been delivered."}

                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

        {/* =====================================================
            ORDER DETAILS
        ===================================================== */}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* PRODUCTS */}

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <h2 className="font-display text-xl font-semibold mb-5">
              Ordered Items
            </h2>

            <div className="space-y-4">

              {order.cartItems.map(
                (item) => {

                  const product =
                    products.find(
                      (p) =>
                        p.id ===
                        item.productId
                    ) ||
                    item.product;

                  return (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex gap-4"
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-20 rounded-lg object-cover bg-charcoal-50"
                      />

                      <div className="flex-1">

                        <p className="text-sm font-semibold text-charcoal">
                          {product.name}
                        </p>

                        <p className="text-xs text-charcoal-400 mt-1">
                          Size:{" "}
                          {item.size}
                        </p>

                        <p className="text-xs text-charcoal-400">
                          Color:{" "}
                          {item.color}
                        </p>

                        <p className="text-xs text-charcoal-400">
                          Quantity:{" "}
                          {item.qty}
                        </p>

                      </div>

                      <p className="text-sm font-semibold">
                        ₹
                        {(
                          Number(
                            product.price
                          ) *
                          Number(
                            item.qty
                          )
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* DELIVERY DETAILS */}

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <h2 className="font-display text-xl font-semibold mb-5">
              Delivery Details
            </h2>

            <div className="space-y-4">

              <div>

                <p className="text-xs uppercase tracking-wider text-charcoal-400">
                  Customer
                </p>

                <p className="text-sm font-medium text-charcoal mt-1">
                  {order.customer.name}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-charcoal-400">
                  Email
                </p>

                <p className="text-sm text-charcoal-500 mt-1">
                  {order.customer.email}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-charcoal-400">
                  Phone
                </p>

                <p className="text-sm text-charcoal-500 mt-1">
                  {order.customer.phone}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-charcoal-400">
                  Delivery Address
                </p>

                <p className="text-sm text-charcoal-500 mt-1 leading-relaxed">
                  {order.customer.address}
                  <br />
                  {order.customer.city},{" "}
                  {order.customer.state}
                  <br />
                  {order.customer.pincode}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-charcoal-400">
                  Payment
                </p>

                <p className="text-sm font-medium text-charcoal mt-1">
                  {order.paymentMethod ===
                  "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>

              </div>

              <div className="border-t border-charcoal-100 pt-4 flex justify-between">

                <span className="font-semibold">
                  Order Total
                </span>

                <span className="font-bold">
                  ₹
                  {order.total.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

