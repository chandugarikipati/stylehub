import { useState } from "react";
import { products } from "../data/products";

type Tab =
  | "dashboard"
  | "products"
  | "orders"
  | "customers"
  | "inventory"
  | "discounts";

const statusColors: Record<string, string> = {
  Processing: "bg-purple-50 text-purple-700",
  Shipped: "bg-amber-50 text-amber-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-600",
};

const miniBar = (
  val: number,
  max: number,
  color = "#C9A84C"
) => (
  <div className="w-full h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all"
      style={{
        width: `${Math.min((val / max) * 100, 100)}%`,
        backgroundColor: color,
      }}
    />
  </div>
);

export default function Admin() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [searchQ, setSearchQ] = useState("");

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "customers", label: "Customers" },
    { id: "inventory", label: "Inventory" },
    { id: "discounts", label: "Discounts" },
  ];

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="pt-28 min-h-screen bg-charcoal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-charcoal">
              Admin Panel
            </h1>

            <p className="text-charcoal-400 text-sm">
              Chandu Clothing — Management Dashboard
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-xs text-charcoal-400">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Live · Updated just now
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-0 bg-white rounded-2xl p-1 shadow-sm mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
                tab === t.id
                  ? "bg-charcoal text-white"
                  : "text-charcoal-500 hover:text-charcoal"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ===================================================== */}
        {/* DASHBOARD */}
        {/* ===================================================== */}

        {tab === "dashboard" && (
          <div className="space-y-6">

            {/* KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">💰</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                    Live
                  </span>
                </div>

                <p className="font-display text-2xl font-bold text-charcoal">
                  ₹0
                </p>

                <p className="text-xs text-charcoal-400 mt-0.5">
                  Total Revenue
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">📦</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-charcoal-50 text-charcoal-500">
                    Live
                  </span>
                </div>

                <p className="font-display text-2xl font-bold text-charcoal">
                  0
                </p>

                <p className="text-xs text-charcoal-400 mt-0.5">
                  Total Orders
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">👥</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-charcoal-50 text-charcoal-500">
                    Live
                  </span>
                </div>

                <p className="font-display text-2xl font-bold text-charcoal">
                  0
                </p>

                <p className="text-xs text-charcoal-400 mt-0.5">
                  Active Customers
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">↩</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-charcoal-50 text-charcoal-500">
                    Live
                  </span>
                </div>

                <p className="font-display text-2xl font-bold text-charcoal">
                  0%
                </p>

                <p className="text-xs text-charcoal-400 mt-0.5">
                  Return Rate
                </p>
              </div>

            </div>

            {/* REVENUE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-charcoal">
                  Revenue Overview
                </h3>

                <select className="text-xs border border-charcoal-200 rounded-lg px-3 py-1.5 outline-none text-charcoal">
                  <option>Last 7 months</option>
                  <option>Last 12 months</option>
                </select>
              </div>

              <div className="flex items-center justify-center h-32 text-sm text-charcoal-400">
                No real orders yet
              </div>

            </div>

            {/* TOP PRODUCTS + RECENT ORDERS */}
            <div className="grid lg:grid-cols-2 gap-6">

              {/* TOP PRODUCTS */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">

                <h3 className="font-semibold text-charcoal mb-4">
                  Top Selling Products
                </h3>

                <div className="space-y-4">

                  {products
                    .filter((p) => p.isBestSeller)
                    .slice(0, 5)
                    .map((p, i) => (
                      <div key={p.id}>

                        <div className="flex items-center justify-between mb-1">

                          <div className="flex items-center gap-3">

                            <span className="text-xs text-charcoal-400 w-4">
                              {i + 1}
                            </span>

                            <img
                              src={`${p.image}?w=40&h=50&fit=crop&auto=format`}
                              alt={p.name}
                              className="w-8 h-10 rounded-lg object-cover bg-charcoal-50"
                            />

                            <div>
                              <p className="text-xs font-medium text-charcoal line-clamp-1">
                                {p.name}
                              </p>

                              <p className="text-[10px] text-charcoal-400">
                                {p.reviewCount} reviews
                              </p>
                            </div>

                          </div>

                          <span className="text-xs font-semibold text-charcoal">
                            ₹{Number(p.price).toLocaleString("en-IN")}
                          </span>

                        </div>

                        {miniBar(Number(p.reviewCount || 0), 900)}

                      </div>
                    ))}

                </div>
              </div>

              {/* RECENT ORDERS */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">

                <h3 className="font-semibold text-charcoal mb-4">
                  Recent Orders
                </h3>

                <div className="py-10 text-center">

                  <div className="text-4xl mb-3">
                    📦
                  </div>

                  <p className="text-sm font-medium text-charcoal">
                    No orders yet
                  </p>

                  <p className="text-xs text-charcoal-400 mt-1">
                    Real customer orders will appear here.
                  </p>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* PRODUCTS */}
        {/* ===================================================== */}

        {tab === "products" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <div className="p-6 border-b border-charcoal-100 flex items-center justify-between flex-wrap gap-4">

              <h2 className="font-semibold text-charcoal">
                Products ({products.length})
              </h2>

              <div className="flex gap-3">

                <input
                  type="text"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search products..."
                  className="border border-charcoal-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-charcoal transition-colors w-48"
                />

                <button
                  type="button"
                  className="bg-charcoal text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-charcoal-800 transition-colors"
                >
                  + Add Product
                </button>

              </div>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="bg-charcoal-50 text-left">

                    {[
                      "Product",
                      "Category",
                      "Price",
                      "Stock",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-xs font-semibold text-charcoal-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}

                  </tr>
                </thead>

                <tbody className="divide-y divide-charcoal-100">

                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-charcoal-50 transition-colors"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <img
                            src={`${p.image}?w=50&h=60&fit=crop&auto=format`}
                            alt={p.name}
                            className="w-10 h-12 rounded-lg object-cover bg-charcoal-50"
                          />

                          <div>

                            <p className="text-sm font-medium text-charcoal">
                              {p.name}
                            </p>

                            <p className="text-xs text-charcoal-400">
                              {p.brand}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm text-charcoal-500 capitalize">
                        {p.category}
                      </td>

                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-charcoal">
                          ₹{Number(p.price).toLocaleString("en-IN")}
                        </p>

                        {Number(p.discount || 0) > 0 && (
                          <p className="text-xs text-green-600">
                            -{p.discount}% off
                          </p>
                        )}

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`text-xs font-medium ${
                            Number(p.stockCount) < 10
                              ? "text-red-600"
                              : Number(p.stockCount) < 25
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {p.stockCount} units
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            p.inStock
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {p.inStock ? "Active" : "Inactive"}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          <button
                            type="button"
                            className="text-xs text-gold hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* ORDERS */}
        {/* ===================================================== */}

        {tab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <div className="p-6 border-b border-charcoal-100">

              <h2 className="font-semibold text-charcoal">
                All Orders
              </h2>

            </div>

            <div className="py-16 text-center">

              <div className="text-5xl mb-4">
                📦
              </div>

              <h3 className="font-display text-2xl font-bold text-charcoal mb-2">
                No Orders Yet
              </h3>

              <p className="text-charcoal-400 text-sm">
                Real customer orders will appear here after customers place orders.
              </p>

            </div>

          </div>
        )}

        {/* ===================================================== */}
        {/* CUSTOMERS / INVENTORY / DISCOUNTS */}
        {/* ===================================================== */}

        {(tab === "customers" ||
          tab === "inventory" ||
          tab === "discounts") && (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">

            <div className="text-5xl mb-4">
              {tab === "customers"
                ? "👥"
                : tab === "inventory"
                ? "📦"
                : "🏷️"}
            </div>

            <h3 className="font-display text-2xl font-bold text-charcoal mb-2">
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Management
            </h3>

            <p className="text-charcoal-400 text-sm">
              This section is ready for integration with your backend API.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

