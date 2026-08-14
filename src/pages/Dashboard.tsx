import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { products } from "../data/products";

type Tab =
  | "overview"
  | "orders"
  | "wishlist"
  | "addresses"
  | "profile";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

interface SavedAddress {
  _id: string;
  userId: string;
  type: string;
  name: string;
  phone: string;
  additionalPhone?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt?: string;
  updatedAt?: string;
}

type SavedAddresses = Record<string, SavedAddress>;

type MembershipLevel =
  | "Member"
  | "Silver"
  | "Gold"
  | "Premium";

interface MembershipData {
  level: MembershipLevel;
  startedAt: string;
  expiresAt: string;
}

const statusColors: Record<string, string> = {
  Delivered: "bg-green-50 text-green-700",
  "Out for Delivery": "bg-blue-50 text-blue-700",
  Shipped: "bg-amber-50 text-amber-700",
  Processing: "bg-purple-50 text-purple-700",
  Cancelled: "bg-red-50 text-red-600",
};

const membershipStyles: Record<
  MembershipLevel,
  {
    label: string;
    description: string;
    className: string;
  }
> = {
  Member: {
    label: "StyleHub Member",
    description: "Welcome to StyleHub",
    className: "bg-charcoal-50 text-charcoal-600",
  },

  Silver: {
    label: "Silver Member",
    description: "3+ orders",
    className: "bg-gray-100 text-gray-700",
  },

  Gold: {
    label: "Gold Member",
    description: "6+ orders",
    className: "bg-yellow-50 text-yellow-700",
  },

  Premium: {
    label: "Premium Member",
    description: "10+ orders",
    className: "bg-gold/10 text-gold",
  },
};

function getMembershipLevel(orderCount: number): MembershipLevel {
  if (orderCount >= 10) {
    return "Premium";
  }

  if (orderCount >= 6) {
    return "Gold";
  }

  if (orderCount >= 3) {
    return "Silver";
  }

  return "Member";
}

function addOneYear(date: Date) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + 1);
  return result;
}

function formatMembershipDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const {
    user,
    logout,
    wishlistIds,
    cartItems,
    orders,
  } = useApp();

  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("overview");

  const [savedAddresses, setSavedAddresses] =
    useState<SavedAddresses>({});

  const [membership, setMembership] =
    useState<MembershipData | null>(null);


  // =====================================================
  // LOAD SAVED ADDRESSES FROM MONGODB
  // =====================================================

  useEffect(() => {
    const loadSavedAddresses = async () => {
      if (!user?.id) {
        setSavedAddresses({});
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/users/${user.id}/addresses`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load saved addresses"
          );
        }

        const addresses: SavedAddress[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.addresses)
          ? data.addresses
          : [];

        const addressMap: SavedAddresses = {};

        addresses.forEach((address) => {
          if (address?.type) {
            addressMap[address.type] = address;
          }
        });

        setSavedAddresses(addressMap);
      } catch (error) {
        console.error(
          "Could not load saved addresses from backend:",
          error
        );

        setSavedAddresses({});
      }
    };

    loadSavedAddresses();
  }, [user?.id]);

  // =====================================================
  // MEMBERSHIP SYSTEM
  // =====================================================

  useEffect(() => {
    const currentLevel = getMembershipLevel(orders.length);
    const storageKey = "stylehub_membership";

    try {
      const stored = localStorage.getItem(storageKey);
      const now = new Date();

      // -------------------------------------------------
      // EXISTING MEMBERSHIP
      // -------------------------------------------------

      if (stored) {
        const existing: MembershipData =
          JSON.parse(stored);

        const expiryDate = new Date(
          existing.expiresAt
        );

        // Membership still active
        if (now < expiryDate) {
          if (existing.level !== currentLevel) {
            const levels: MembershipLevel[] = [
              "Member",
              "Silver",
              "Gold",
              "Premium",
            ];

            const oldIndex = levels.indexOf(
              existing.level
            );

            const newIndex = levels.indexOf(
              currentLevel
            );

            // Upgrade only
            if (newIndex > oldIndex) {
              const updated: MembershipData = {
                ...existing,
                level: currentLevel,
              };

              setMembership(updated);

              localStorage.setItem(
                storageKey,
                JSON.stringify(updated)
              );

              return;
            }
          }

          setMembership(existing);
          return;
        }

        // -------------------------------------------------
        // MEMBERSHIP EXPIRED
        // -------------------------------------------------

        const newStartDate = new Date();

        const newMembership: MembershipData = {
          level: currentLevel,
          startedAt: newStartDate.toISOString(),
          expiresAt: addOneYear(
            newStartDate
          ).toISOString(),
        };

        setMembership(newMembership);

        localStorage.setItem(
          storageKey,
          JSON.stringify(newMembership)
        );

        return;
      }

      // -------------------------------------------------
      // FIRST MEMBERSHIP CREATION
      // -------------------------------------------------

      const startDate = new Date();

      const newMembership: MembershipData = {
        level: currentLevel,
        startedAt: startDate.toISOString(),
        expiresAt: addOneYear(
          startDate
        ).toISOString(),
      };

      setMembership(newMembership);

      localStorage.setItem(
        storageKey,
        JSON.stringify(newMembership)
      );
    } catch (error) {
      console.error(
        "Could not load membership:",
        error
      );
    }
  }, [orders.length]);

  // =====================================================
  // LOGIN CHECK
  // =====================================================

  if (!user) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
            Please sign in to view your account
          </h2>

          <Link
            to="/login"
            className="bg-charcoal text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-charcoal-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // WISHLIST PRODUCTS
  // =====================================================

  const wishlistProducts = wishlistIds
    .map((id) =>
      products.find((p) => p.id === id)
    )
    .filter(Boolean) as typeof products;

  // =====================================================
  // REMOVE ADDRESS FROM MONGODB
  // =====================================================

  const removeAddress = async (type: string) => {
    const address = savedAddresses[type];

    if (!address?._id) {
      console.error("Address ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/addresses/${address._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete address"
        );
      }

      setSavedAddresses((previous) => {
        const updated = { ...previous };
        delete updated[type];
        return updated;
      });
    } catch (error) {
      console.error("Could not delete address:", error);
    }
  };

  // =====================================================
  // PROFILE ICON
  // =====================================================

  const ProfileIcon = ({
    size = "w-10 h-10",
  }: {
    size?: string;
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={size}
      >
        <circle
          cx="12"
          cy="8"
          r="3.5"
        />

        <path
          d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  // =====================================================
  // MEMBERSHIP INFORMATION
  // =====================================================

  const membershipLevel =
    membership?.level ?? "Member";

  const membershipStyle =
    membershipStyles[membershipLevel];

  const membershipExpired = membership
    ? new Date() > new Date(membership.expiresAt)
    : false;

  // =====================================================
  // TABS
  // =====================================================

  const tabs: {
    id: Tab;
    label: string;
    icon: string;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: "âŠž",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "ðŸ“¦",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: "â™¡",
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: "ðŸ“",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "ðŸ‘¤",
    },
  ];

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="pt-28 min-h-screen bg-charcoal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        <div className="grid lg:grid-cols-4 gap-8">

          {/* =====================================================
              SIDEBAR
          ===================================================== */}

          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 text-center">

              <div className="w-20 h-20 rounded-full bg-charcoal text-white flex items-center justify-center mx-auto mb-3 border-4 border-charcoal-100">
                <ProfileIcon size="w-10 h-10" />
              </div>

              <h3 className="font-semibold text-charcoal">
                {user.name}
              </h3>

              <p className="text-xs text-charcoal-400 mt-0.5">
                {user.email}
              </p>

              <span
                className={`text-xs font-medium mt-2 px-3 py-1 rounded-full inline-block ${membershipStyle.className}`}
              >
                {membershipStyle.label}
              </span>

            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">

              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-3 w-full px-5 py-3.5 text-sm font-medium transition-colors border-l-2 ${
                    tab === t.id
                      ? "border-gold bg-gold/5 text-charcoal"
                      : "border-transparent text-charcoal-500 hover:bg-charcoal-50 hover:text-charcoal"
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border-l-2 border-transparent"
              >
                <span>â†’</span>
                Sign Out
              </button>

            </div>

          </div>

          {/* =====================================================
              MAIN CONTENT
          ===================================================== */}

          <div className="lg:col-span-3">

            {/* =====================================================
                OVERVIEW
            ===================================================== */}

            {tab === "overview" && (
              <div className="space-y-6">

                <h2 className="font-display text-2xl font-bold text-charcoal">
                  Hello,{" "}
                  {user.name.split(" ")[0]} ðŸ‘‹
                </h2>

                {/* STAT CARDS */}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                  {[
                    {
                      label: "Total Orders",
                      value: orders.length,
                      icon: "ðŸ“¦",
                    },
                    {
                      label: "Wishlist Items",
                      value: wishlistIds.length,
                      icon: "â™¡",
                    },
                    {
                      label: "Cart Items",
                      value: cartItems.reduce(
                        (sum, item) =>
                          sum + item.qty,
                        0
                      ),
                      icon: "ðŸ›’",
                    },
                    {
                      label: "Saved Addresses",
                      value:
                        Object.keys(
                          savedAddresses
                        ).length,
                      icon: "ðŸ“",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-2xl p-5 shadow-sm text-center"
                    >
                      <div className="text-3xl mb-2">
                        {stat.icon}
                      </div>

                      <p className="font-display text-2xl font-bold text-charcoal">
                        {stat.value}
                      </p>

                      <p className="text-xs text-charcoal-400 mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  ))}

                </div>

                {/* MEMBERSHIP CARD */}

                <div className="bg-white rounded-2xl p-6 shadow-sm">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                    <div>
                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold">
                        StyleHub Membership
                      </p>

                      <h3 className="font-display text-2xl font-bold text-charcoal mt-1">
                        {membershipStyle.label}
                      </h3>

                      <p className="text-sm text-charcoal-500 mt-2">
                        {membershipStyle.description}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">

                      {membershipExpired ? (
                        <p className="text-sm font-semibold text-red-600">
                          Membership Expired
                        </p>
                      ) : membership ? (
                        <>
                          <p className="text-xs text-charcoal-400">
                            Valid until
                          </p>

                          <p className="text-sm font-semibold text-charcoal mt-1">
                            {formatMembershipDate(
                              membership.expiresAt
                            )}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-charcoal-400">
                          Loading...
                        </p>
                      )}

                    </div>

                  </div>

                  {/* PROGRESS TO NEXT LEVEL */}

                  <div className="mt-6 pt-5 border-t border-charcoal-100">

                    {orders.length < 3 && (
                      <>
                        <div className="flex justify-between text-xs mb-2">
                          <span>
                            Orders: {orders.length}/3
                          </span>

                          <span>
                            Silver Member
                          </span>
                        </div>

                        <div className="w-full h-2 bg-charcoal-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold rounded-full"
                            style={{
                              width: `${Math.min(
                                (orders.length / 3) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </>
                    )}

                    {orders.length >= 3 &&
                      orders.length < 6 && (
                        <>
                          <div className="flex justify-between text-xs mb-2">
                            <span>
                              Orders: {orders.length}/6
                            </span>

                            <span>
                              Gold Member
                            </span>
                          </div>

                          <div className="w-full h-2 bg-charcoal-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold rounded-full"
                              style={{
                                width: `${Math.min(
                                  (orders.length / 6) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </>
                      )}

                    {orders.length >= 6 &&
                      orders.length < 10 && (
                        <>
                          <div className="flex justify-between text-xs mb-2">
                            <span>
                              Orders: {orders.length}/10
                            </span>

                            <span>
                              Premium Member
                            </span>
                          </div>

                          <div className="w-full h-2 bg-charcoal-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold rounded-full"
                              style={{
                                width: `${Math.min(
                                  (orders.length / 10) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </>
                      )}

                    {orders.length >= 10 && (
                      <div className="text-sm text-gold font-medium">
                        ðŸŽ‰ You have reached the highest StyleHub membership level.
                      </div>
                    )}

                  </div>

                </div>

                {/* RECENT ORDERS */}

                <div className="bg-white rounded-2xl p-6 shadow-sm">

                  <h3 className="font-semibold text-charcoal mb-4">
                    Recent Orders
                  </h3>

                  {orders.length === 0 ? (

                    <div className="text-center py-8">

                      <div className="text-4xl mb-3">
                        ðŸ“¦
                      </div>

                      <p className="text-sm text-charcoal-400">
                        You haven't placed any orders yet.
                      </p>

                      <Link
                        to="/products"
                        className="inline-block mt-4 bg-charcoal text-white px-6 py-2.5 rounded-xl text-sm"
                      >
                        Start Shopping
                      </Link>

                    </div>

                  ) : (

                    <div className="space-y-4">

                      {orders
                        .slice(0, 3)
                        .map((order) => (

                          <div
                            key={order.id}
                            className="flex items-center justify-between border-b border-charcoal-100 pb-4 last:border-0 last:pb-0"
                          >

                            <div>
                              <p className="text-sm font-medium text-charcoal">
                                {order.id}
                              </p>

                              <p className="text-xs text-charcoal-400">
                                {order.date} Â·{" "}
                                {order.items}{" "}
                                item
                                {order.items > 1
                                  ? "s"
                                  : ""}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">

                              <span className="font-semibold text-sm text-charcoal">
                                â‚¹
                                {order.total.toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                              <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                  statusColors[
                                    order.status
                                  ] ||
                                  "bg-charcoal-50 text-charcoal-500"
                                }`}
                              >
                                {order.status}
                              </span>

                            </div>

                          </div>

                        ))}

                    </div>

                  )}

                  {orders.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setTab("orders")}
                      className="text-sm text-gold hover:underline mt-4 block"
                    >
                      View all orders â†’
                    </button>
                  )}

                </div>

              </div>
            )}

            {/* =====================================================
                ORDERS
            ===================================================== */}

            {tab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                <div className="p-6 border-b border-charcoal-100">

                  <h2 className="font-display text-2xl font-bold text-charcoal">
                    Order History
                  </h2>

                  <p className="text-sm text-charcoal-400 mt-1">
                    Your orders will appear here after you place them.
                  </p>

                </div>

                {orders.length === 0 ? (

                  <div className="p-12 text-center">

                    <div className="text-5xl mb-4">
                      ðŸ“¦
                    </div>

                    <h3 className="font-semibold text-lg text-charcoal">
                      No orders yet
                    </h3>

                    <p className="text-sm text-charcoal-400 mt-2">
                      You haven't placed any orders.
                    </p>

                    <Link
                      to="/products"
                      className="inline-block mt-6 bg-charcoal text-white px-8 py-3 rounded-xl text-sm font-medium"
                    >
                      Browse Products
                    </Link>

                  </div>

                ) : (

                  <div className="divide-y divide-charcoal-100">

                    {orders.map((order) => (

                      <div
                        key={order.id}
                        className="p-6 hover:bg-charcoal-50 transition-colors"
                      >

                        <div className="flex items-start justify-between flex-wrap gap-4">

                          <div>

                            <div className="flex items-center gap-3 mb-1">

                              <p className="text-sm font-bold text-charcoal">
                                {order.id}
                              </p>

                              <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                  statusColors[
                                    order.status
                                  ] ||
                                  "bg-charcoal-50 text-charcoal-500"
                                }`}
                              >
                                {order.status}
                              </span>

                            </div>

                            <p className="text-xs text-charcoal-400">
                              {order.date} Â·{" "}
                              {order.items}{" "}
                              item
                              {order.items > 1
                                ? "s"
                                : ""}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="font-bold text-charcoal">
                              â‚¹
                              {order.total.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            <div className="flex gap-2 mt-2">

                              {order.products
                                .slice(0, 3)
                                .map((productId) => {

                                  const product =
                                    products.find(
                                      (p) =>
                                        p.id ===
                                        productId
                                    );

                                  if (!product) {
                                    return null;
                                  }

                                  return (
                                    <img
                                      key={productId}
                                      src={`${product.image}?w=60&h=70&fit=crop&auto=format`}
                                      alt={product.name}
                                      className="w-10 h-12 rounded-lg object-cover bg-charcoal-50"
                                    />
                                  );
                                })}

                            </div>

                          </div>

                        </div>

                        <div className="flex gap-3 mt-4">

                          <Link
                            to={`/order-tracking?orderId=${order.id}`}
                            className="text-xs border border-charcoal-200 text-charcoal px-4 py-2 rounded-xl hover:border-charcoal transition-colors"
                          >
                            Track Order
                          </Link>

                          {order.status ===
                            "Delivered" && (
                            <button
                              type="button"
                              className="text-xs border border-charcoal-200 text-charcoal px-4 py-2 rounded-xl hover:border-charcoal transition-colors"
                            >
                              Return
                            </button>
                          )}

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>
            )}

            {/* =====================================================
                WISHLIST
            ===================================================== */}

            {tab === "wishlist" && (
              <div>

                <h2 className="font-display text-2xl font-bold text-charcoal mb-6">
                  My Wishlist ({wishlistProducts.length})
                </h2>

                {wishlistProducts.length === 0 ? (

                  <div className="bg-white rounded-2xl p-12 shadow-sm text-center">

                    <p className="text-4xl mb-4">
                      â™¡
                    </p>

                    <p className="text-charcoal-400 text-sm mb-4">
                      Your wishlist is empty
                    </p>

                    <Link
                      to="/products"
                      className="bg-charcoal text-white px-8 py-3 rounded-xl text-sm font-medium"
                    >
                      Browse Products
                    </Link>

                  </div>

                ) : (

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                    {wishlistProducts.map(
                      (product) => (

                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow"
                        >

                          <div className="aspect-[3/4] overflow-hidden">

                            <img
                              src={`${product.image}?w=300&h=400&fit=crop&auto=format`}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                          </div>

                          <div className="p-3">

                            <p className="text-xs text-charcoal-400 uppercase tracking-wider">
                              {product.brand}
                            </p>

                            <p className="text-sm font-medium text-charcoal mt-0.5 line-clamp-1">
                              {product.name}
                            </p>

                            <p className="text-sm font-bold text-charcoal mt-1">
                              â‚¹
                              {product.price.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                        </Link>

                      )
                    )}

                  </div>

                )}

              </div>
            )}

            {/* =====================================================
                ADDRESSES
            ===================================================== */}

            {tab === "addresses" && (
              <div>

                <h2 className="font-display text-2xl font-bold text-charcoal mb-6">
                  Saved Addresses
                </h2>

                {Object.keys(savedAddresses).length === 0 ? (

                  <div className="bg-white rounded-2xl p-12 shadow-sm text-center">

                    <div className="text-5xl mb-4">
                      ðŸ“
                    </div>

                    <h3 className="font-semibold text-lg text-charcoal">
                      No saved addresses
                    </h3>

                    <p className="text-sm text-charcoal-400 mt-2 max-w-md mx-auto">
                      You don't have any saved delivery addresses yet. You can save an address during checkout.
                    </p>

                    <Link
                      to="/checkout"
                      className="inline-block mt-6 bg-charcoal text-white px-7 py-3 rounded-xl text-sm font-medium"
                    >
                      Go to Checkout
                    </Link>

                  </div>

                ) : (

                  <div className="grid sm:grid-cols-2 gap-4">

                    {Object.entries(
                      savedAddresses
                    ).map(
                      ([type, address]) => (

                        <div
                          key={type}
                          className="bg-white rounded-2xl p-6 shadow-sm"
                        >

                          <div className="flex items-center justify-between mb-4">

                            <span className="text-xs font-bold uppercase tracking-wider bg-charcoal-50 text-charcoal px-2.5 py-1 rounded-lg">
                              {type}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                removeAddress(type)
                              }
                              className="text-xs text-red-500 hover:text-red-700 transition-colors"
                            >
                              Remove
                            </button>

                          </div>

                          <p className="text-sm font-semibold text-charcoal">
                            {address.name ||
                              user.name}
                          </p>

                          <p className="text-sm text-charcoal-500 mt-1 leading-relaxed">
                            {address.address}
                          </p>

                          <p className="text-sm text-charcoal-500 mt-1">
                            {address.city},{" "}
                            {address.state} -{" "}
                            {address.pincode}
                          </p>

                          {address.phone && (
                            <p className="text-sm text-charcoal-500 mt-1">
                              {address.phone}
                            </p>
                          )}

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>
            )}

            {/* =====================================================
                PROFILE
            ===================================================== */}

            {tab === "profile" && (
              <div className="space-y-6">

                {/* PROFILE */}

                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">

                  <h2 className="font-display text-2xl font-bold text-charcoal mb-6">
                    My Profile
                  </h2>

                  <div className="flex items-center gap-5 mb-8 pb-8 border-b border-charcoal-100">

                    <div className="w-20 h-20 rounded-full bg-charcoal text-white flex items-center justify-center border-4 border-charcoal-100">
                      <ProfileIcon size="w-10 h-10" />
                    </div>

                    <div>

                      <h3 className="font-semibold text-lg text-charcoal">
                        {user.name}
                      </h3>

                      <p className="text-sm text-charcoal-400 mt-1">
                        {user.email}
                      </p>

                      <p className="text-xs text-charcoal-500 mt-2">
                        StyleHub account
                      </p>

                    </div>

                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">

                    <div>

                      <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
                        First Name
                      </label>

                      <input
                        type="text"
                        defaultValue={
                          user.name.split(
                            " "
                          )[0] || ""
                        }
                        className="w-full border border-charcoal-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-charcoal transition-colors"
                      />

                    </div>

                    <div>

                      <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
                        Last Name
                      </label>

                      <input
                        type="text"
                        defaultValue={
                          user.name
                            .split(" ")
                            .slice(1)
                            .join(" ") ||
                          ""
                        }
                        className="w-full border border-charcoal-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-charcoal transition-colors"
                      />

                    </div>

                    <div>

                      <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>

                      <input
                        type="email"
                        defaultValue={
                          user.email
                        }
                        className="w-full border border-charcoal-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-charcoal transition-colors"
                      />

                    </div>

                    <div>

                      <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        defaultValue="+91"
                        placeholder="Phone Number"
                        className="w-full border border-charcoal-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-charcoal transition-colors"
                      />

                    </div>

                  </div>

                  <button
                    type="button"
                    className="mt-8 bg-gold text-charcoal px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gold-dark hover:text-white transition-all duration-200"
                  >
                    Save Changes
                  </button>

                </div>

                {/* MEMBERSHIP DETAILS */}

                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">

                  <div className="flex items-center justify-between flex-wrap gap-4">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold">
                        Your Membership
                      </p>

                      <h3 className="font-display text-2xl font-bold text-charcoal mt-1">
                        {membershipStyle.label}
                      </h3>

                    </div>

                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-semibold ${membershipStyle.className}`}
                    >
                      {membershipLevel}
                    </span>

                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mt-6">

                    <div className="bg-charcoal-50 rounded-xl p-4">

                      <p className="text-xs text-charcoal-400">
                        Total Orders
                      </p>

                      <p className="text-xl font-bold text-charcoal mt-1">
                        {orders.length}
                      </p>

                    </div>

                    <div className="bg-charcoal-50 rounded-xl p-4">

                      <p className="text-xs text-charcoal-400">
                        Started
                      </p>

                      <p className="text-sm font-semibold text-charcoal mt-1">
                        {membership
                          ? formatMembershipDate(
                              membership.startedAt
                            )
                          : "Loading..."}
                      </p>

                    </div>

                    <div className="bg-charcoal-50 rounded-xl p-4">

                      <p className="text-xs text-charcoal-400">
                        Valid Until
                      </p>

                      <p className="text-sm font-semibold text-charcoal mt-1">
                        {membership
                          ? formatMembershipDate(
                              membership.expiresAt
                            )
                          : "Loading..."}
                      </p>

                    </div>

                  </div>

                  <p className="text-xs text-charcoal-400 mt-5">
                    Membership is automatically reviewed based on your StyleHub order history and is valid for one year.
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
