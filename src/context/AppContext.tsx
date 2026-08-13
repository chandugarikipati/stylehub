import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

import type { Product } from "../data/products";

// =====================================================
// TYPES
// =====================================================

export interface CartItem {
  productId: string;
  product: Product;
  size: string;
  color: string;
  qty: number;
}

export interface Order {
  id: string;
  userEmail: string;
  date: string;
  status:
    | "Processing"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  items: number;
  total: number;
  products: string[];
  orderItems: CartItem[];
}

interface ToastMsg {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AppContextValue {
  cartItems: CartItem[];
  wishlistIds: string[];
  user: User | null;
  toasts: ToastMsg[];
  orders: Order[];

  addToCart: (
    product: Product,
    size: string,
    color: string,
    qty?: number
  ) => boolean;

  removeFromCart: (
    productId: string,
    size: string,
    color: string
  ) => void;

  updateCartQty: (
    productId: string,
    size: string,
    color: string,
    qty: number
  ) => void;

  clearCart: () => void;

  toggleWishlist: (productId: string) => boolean;

  isWishlisted: (productId: string) => boolean;

  cartTotal: number;
  cartCount: number;

  createOrder: () => Order | null;

  getUserOrders: () => Order[];

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  googleLogin: (
    credential: string
  ) => Promise<boolean>;

  logout: () => void;

  showToast: (
    message: string,
    type?: "success" | "error" | "info"
  ) => void;
}

// =====================================================
// STORAGE KEYS
// =====================================================

const USER_STORAGE_KEY = "stylehub_user";

// Old global keys are intentionally removed.
// Every account now gets its own cart/wishlist.
const OLD_CART_KEY = "stylehub_cart";
const OLD_WISHLIST_KEY = "stylehub_wishlist";
const OLD_ORDERS_KEY = "stylehub_orders";

const getCartKey = (userId: string) =>
  `stylehub_cart_${userId}`;

const getWishlistKey = (userId: string) =>
  `stylehub_wishlist_${userId}`;

const getOrdersKey = (userId: string) =>
  `stylehub_orders_${userId}`;

// =====================================================
// CONTEXT
// =====================================================

const AppContext =
  createContext<AppContextValue | null>(null);

// =====================================================
// PRODUCT ID
// =====================================================

function getProductId(product: Product): string {
  const item = product as Product & {
    _id?: string;
    id?: string | number;
  };

  if (item._id) {
    return String(item._id);
  }

  if (
    item.id !== undefined &&
    item.id !== null
  ) {
    return String(item.id);
  }

  return "";
}

// =====================================================
// STORAGE HELPERS
// =====================================================

function readStorage<T>(
  key: string,
  fallback: T
): T {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    return JSON.parse(saved) as T;
  } catch (error) {
    console.error(
      `Failed to read ${key}:`,
      error
    );

    return fallback;
  }
}

function saveStorage<T>(
  key: string,
  value: T
): void {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.error(
      `Failed to save ${key}:`,
      error
    );
  }
}

function removeOldSharedStorage() {
  localStorage.removeItem(OLD_CART_KEY);
  localStorage.removeItem(OLD_WISHLIST_KEY);
  localStorage.removeItem(OLD_ORDERS_KEY);
}

// =====================================================
// PROVIDER
// =====================================================

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  // ---------------------------------------------------
  // USER
  // ---------------------------------------------------

  const [user, setUser] =
    useState<User | null>(() =>
      readStorage<User | null>(
        USER_STORAGE_KEY,
        null
      )
    );

  // ---------------------------------------------------
  // USER DATA
  // ---------------------------------------------------

  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  const [wishlistIds, setWishlistIds] =
    useState<string[]>([]);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [storageReady, setStorageReady] =
    useState(false);

  const [toasts, setToasts] =
    useState<ToastMsg[]>([]);

  // ---------------------------------------------------
  // LOAD USER-SPECIFIC DATA
  // ---------------------------------------------------

  useEffect(() => {
    setStorageReady(false);

    if (!user) {
      setCartItems([]);
      setWishlistIds([]);
      setOrders([]);

      // Remove the old shared storage so old
      // logged-out data cannot appear again.
      removeOldSharedStorage();

      setStorageReady(true);
      return;
    }

    const userId = String(user.id);

    const userCart = readStorage<CartItem[]>(
      getCartKey(userId),
      []
    );

    const userWishlist =
      readStorage<string[]>(
        getWishlistKey(userId),
        []
      );

    const userOrders =
      readStorage<Order[]>(
        getOrdersKey(userId),
        []
      );

    setCartItems(userCart);
    setWishlistIds(userWishlist);
    setOrders(userOrders);

    setStorageReady(true);
  }, [user]);

  // ---------------------------------------------------
  // SAVE USER
  // ---------------------------------------------------

  useEffect(() => {
    if (user) {
      saveStorage(
        USER_STORAGE_KEY,
        user
      );
    } else {
      localStorage.removeItem(
        USER_STORAGE_KEY
      );
    }
  }, [user]);

  // ---------------------------------------------------
  // SAVE CART FOR CURRENT USER ONLY
  // ---------------------------------------------------

  useEffect(() => {
    if (!storageReady || !user) {
      return;
    }

    saveStorage(
      getCartKey(String(user.id)),
      cartItems
    );
  }, [
    cartItems,
    user,
    storageReady,
  ]);

  // ---------------------------------------------------
  // SAVE WISHLIST FOR CURRENT USER ONLY
  // ---------------------------------------------------

  useEffect(() => {
    if (!storageReady || !user) {
      return;
    }

    saveStorage(
      getWishlistKey(String(user.id)),
      wishlistIds
    );
  }, [
    wishlistIds,
    user,
    storageReady,
  ]);

  // ---------------------------------------------------
  // SAVE ORDERS FOR CURRENT USER ONLY
  // ---------------------------------------------------

  useEffect(() => {
    if (!storageReady || !user) {
      return;
    }

    saveStorage(
      getOrdersKey(String(user.id)),
      orders
    );
  }, [
    orders,
    user,
    storageReady,
  ]);

  // =====================================================
  // TOAST
  // =====================================================

  const showToast = useCallback(
    (
      message: string,
      type:
        | "success"
        | "error"
        | "info" = "success"
    ) => {
      const id = Date.now();

      setToasts((previous) => [
        ...previous,
        {
          id,
          message,
          type,
        },
      ]);

      setTimeout(() => {
        setToasts((previous) =>
          previous.filter(
            (toast) =>
              toast.id !== id
          )
        );
      }, 3500);
    },
    []
  );

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = useCallback(
    (
      product: Product,
      size: string,
      color: string,
      qty = 1
    ): boolean => {
      // -----------------------------------------------
      // LOGIN REQUIRED
      // -----------------------------------------------

      if (!user) {
        showToast(
          "Please login to add items to your cart.",
          "error"
        );

        return false;
      }

      if (!product) {
        showToast(
          "Unable to add this product.",
          "error"
        );

        return false;
      }

      const productId =
        getProductId(product);

      if (!productId) {
        showToast(
          "Product ID is missing.",
          "error"
        );

        return false;
      }

      if (qty < 1) {
        return false;
      }

      setCartItems((previous) => {
        const existing =
          previous.find(
            (item) =>
              item.productId ===
                productId &&
              item.size === size &&
              item.color === color
          );

        if (existing) {
          return previous.map(
            (item) =>
              item.productId ===
                  productId &&
                item.size === size &&
                item.color === color
                ? {
                    ...item,
                    qty:
                      item.qty + qty,
                  }
                : item
          );
        }

        return [
          ...previous,
          {
            productId,
            product,
            size,
            color,
            qty,
          },
        ];
      });

      showToast(
        `${product.name} added to cart`,
        "success"
      );

      return true;
    },
    [user, showToast]
  );

  // =====================================================
  // REMOVE CART ITEM
  // =====================================================

  const removeFromCart =
    useCallback(
      (
        productId: string,
        size: string,
        color: string
      ) => {
        if (!user) {
          return;
        }

        setCartItems((previous) =>
          previous.filter(
            (item) =>
              !(
                item.productId ===
                  productId &&
                item.size === size &&
                item.color === color
              )
          )
        );

        showToast(
          "Item removed from cart",
          "info"
        );
      },
      [user, showToast]
    );

  // =====================================================
  // UPDATE CART
  // =====================================================

  const updateCartQty =
    useCallback(
      (
        productId: string,
        size: string,
        color: string,
        qty: number
      ) => {
        if (!user) {
          return;
        }

        if (qty <= 0) {
          setCartItems((previous) =>
            previous.filter(
              (item) =>
                !(
                  item.productId ===
                    productId &&
                  item.size === size &&
                  item.color === color
                )
            )
          );

          return;
        }

        setCartItems((previous) =>
          previous.map(
            (item) =>
              item.productId ===
                  productId &&
                item.size === size &&
                item.color === color
                ? {
                    ...item,
                    qty,
                  }
                : item
          )
        );
      },
      [user]
    );

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart =
    useCallback(() => {
      setCartItems([]);

      if (user) {
        localStorage.setItem(
          getCartKey(String(user.id)),
          JSON.stringify([])
        );
      }
    }, [user]);

  // =====================================================
  // WISHLIST
  // =====================================================

  const toggleWishlist =
    useCallback(
      (productId: string): boolean => {
        // -----------------------------------------------
        // LOGIN REQUIRED
        // -----------------------------------------------

        if (!user) {
          showToast(
            "Please login to add items to your favorites.",
            "error"
          );

          return false;
        }

        if (!productId) {
          return false;
        }

        let added = false;

        setWishlistIds((previous) => {
          if (
            previous.includes(productId)
          ) {
            showToast(
              "Removed from favorites",
              "info"
            );

            return previous.filter(
              (id) =>
                id !== productId
            );
          }

          added = true;

          showToast(
            "Added to favorites",
            "success"
          );

          return [
            ...previous,
            productId,
          ];
        });

        return added;
      },
      [user, showToast]
    );

  // =====================================================
  // IS WISHLISTED
  // =====================================================

  const isWishlisted =
    useCallback(
      (productId: string) => {
        if (!user) {
          return false;
        }

        return wishlistIds.includes(
          productId
        );
      },
      [wishlistIds, user]
    );

  // =====================================================
  // CART TOTAL
  // =====================================================

  const cartCount = useMemo(
    () =>
      user
        ? cartItems.reduce(
            (total, item) =>
              total +
              Number(
                item.qty || 0
              ),
            0
          )
        : 0,
    [cartItems, user]
  );

  const cartTotal = useMemo(
    () =>
      user
        ? cartItems.reduce(
            (total, item) => {
              const price =
                Number(
                  item.product?.price ||
                    0
                );

              const quantity =
                Number(
                  item.qty || 0
                );

              return (
                total +
                price * quantity
              );
            },
            0
          )
        : 0,
    [cartItems, user]
  );

  // =====================================================
  // CREATE ORDER
  // =====================================================

  const createOrder =
    useCallback((): Order | null => {
      if (!user) {
        showToast(
          "Please login before placing an order.",
          "error"
        );

        return null;
      }

      if (cartItems.length === 0) {
        showToast(
          "Your cart is empty.",
          "error"
        );

        return null;
      }

      const orderId =
        `CHN-${new Date().getFullYear()}-${Date.now()
          .toString()
          .slice(-6)}`;

      const order: Order = {
        id: orderId,
        userEmail: user.email,
        date:
          new Date().toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),
        status: "Processing",
        items: cartCount,
        total: cartTotal,
        products:
          cartItems.map(
            (item) =>
              item.productId
          ),
        orderItems: [
          ...cartItems,
        ],
      };

      setOrders((previous) => [
        order,
        ...previous,
      ]);

      setCartItems([]);

      showToast(
        `Order ${orderId} placed successfully!`,
        "success"
      );

      return order;
    }, [
      user,
      cartItems,
      cartCount,
      cartTotal,
      showToast,
    ]);

  // =====================================================
  // USER ORDERS
  // =====================================================

  const getUserOrders =
    useCallback(() => {
      if (!user) {
        return [];
      }

      return orders.filter(
        (order) =>
          order.userEmail ===
          user.email
      );
    }, [orders, user]);

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<boolean> => {
      try {
        const response =
          await fetch(
            "http://localhost:5000/api/users/login",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                email:
                  email.trim(),
                password,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          showToast(
            data.message ||
              "Login failed",
            "error"
          );

          return false;
        }

        if (!data.user) {
          showToast(
            "Invalid server response.",
            "error"
          );

          return false;
        }

        const userId = String(
          data.user.id ??
            data.user._id ??
            ""
        );

        if (!userId) {
          showToast(
            "User ID missing from server.",
            "error"
          );

          return false;
        }

        const loggedInUser: User = {
          id: userId,
          name:
            data.user.name ||
            "StyleHub User",
          email:
            data.user.email,
          phone:
            data.user.phone ||
            "",
          avatar:
            data.user.avatar ||
            "",
        };

        // Clear current account data
        // before switching accounts.
        setCartItems([]);
        setWishlistIds([]);
        setOrders([]);

        setUser(
          loggedInUser
        );

        showToast(
          `Welcome back, ${loggedInUser.name}!`,
          "success"
        );

        return true;
      } catch (error) {
        console.error(
          "Login error:",
          error
        );

        showToast(
          "Cannot connect to server. Make sure the backend is running.",
          "error"
        );

        return false;
      }
    },
    [showToast]
  );

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const googleLogin =
    useCallback(
      async (
        credential: string
      ): Promise<boolean> => {
        try {
          const response =
            await fetch(
              "http://localhost:5000/api/users/google-login",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  credential,
                }),
              }
            );

          const data =
            await response.json();

          console.log(
            "Google backend response:",
            data
          );

          if (!response.ok) {
            showToast(
              data.message ||
                "Google login failed.",
              "error"
            );

            return false;
          }

          if (!data.user) {
            showToast(
              "Google login returned no user.",
              "error"
            );

            return false;
          }

          const userId = String(
            data.user.id ??
              data.user._id ??
              ""
          );

          if (!userId) {
            showToast(
              "Google account has no user ID.",
              "error"
            );

            return false;
          }

          const loggedInUser: User = {
            id: userId,
            name:
              data.user.name ||
              "StyleHub User",
            email:
              data.user.email,
            phone:
              data.user.phone ||
              "",
            avatar:
              data.user.avatar ||
              "",
          };

          // Clear previous account data.
          setCartItems([]);
          setWishlistIds([]);
          setOrders([]);

          setUser(
            loggedInUser
          );

          showToast(
            `Welcome ${loggedInUser.name}!`,
            "success"
          );

          return true;
        } catch (error) {
          console.error(
            "Google login error:",
            error
          );

          showToast(
            "Cannot connect to Google login server.",
            "error"
          );

          return false;
        }
      },
      [showToast]
    );

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout =
    useCallback(() => {
      // IMPORTANT:
      // Clear everything from the UI immediately.
      setCartItems([]);
      setWishlistIds([]);
      setOrders([]);

      // Remove old shared storage.
      removeOldSharedStorage();

      // User-specific data remains safely stored
      // under that user's ID for their next login.
      setUser(null);

      showToast(
        "Logged out successfully. Cart and favorites are now empty.",
        "info"
      );
    }, [showToast]);

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value =
    useMemo<AppContextValue>(
      () => ({
        cartItems,
        wishlistIds,
        user,
        toasts,
        orders,

        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,

        toggleWishlist,
        isWishlisted,

        cartTotal,
        cartCount,

        createOrder,
        getUserOrders,

        login,
        googleLogin,

        logout,
        showToast,
      }),
      [
        cartItems,
        wishlistIds,
        user,
        toasts,
        orders,

        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,

        toggleWishlist,
        isWishlisted,

        cartTotal,
        cartCount,

        createOrder,
        getUserOrders,

        login,
        googleLogin,

        logout,
        showToast,
      ]
    );

  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  );
}

// =====================================================
// USE APP
// =====================================================

export function useApp() {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used within AppProvider"
    );
  }

  return context;
}