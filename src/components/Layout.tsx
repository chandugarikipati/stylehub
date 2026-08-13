import { Outlet, Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Layout() {
  const { cartCount, wishlistIds } = useApp();
  const location = useLocation();

  const pathname = location.pathname;
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  const active =
    "bg-black text-white font-bold px-4 py-2.5 rounded-lg transition-all";

  const normal =
    "text-black font-medium px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all";

  const homeActive =
    pathname === "/";

  const shopActive =
    pathname === "/products" && !category;

  const womenActive =
    pathname === "/products" && category === "women";

  const menActive =
    pathname === "/products" && category === "men";

  const kidsActive =
    pathname === "/products" && category === "kids";

  const accessoriesActive =
    pathname === "/products" && category === "accessories";

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6">

          <div className="h-20 flex items-center justify-between">

            {/* LOGO */}
            <Link
              to="/"
              className="text-2xl font-bold text-black"
            >
              STYLEHUB
            </Link>

            {/* NAVIGATION */}
            <nav className="flex items-center gap-2">

              <Link
                to="/"
                className={
                  homeActive
                    ? active
                    : normal
                }
              >
                Home
              </Link>

              <Link
                to="/products"
                className={
                  shopActive
                    ? active
                    : normal
                }
              >
                Shop
              </Link>

              <Link
                to="/products?category=women"
                className={
                  womenActive
                    ? active
                    : normal
                }
              >
                Women
              </Link>

              <Link
                to="/products?category=men"
                className={
                  menActive
                    ? active
                    : normal
                }
              >
                Men
              </Link>

              <Link
                to="/products?category=kids"
                className={
                  kidsActive
                    ? active
                    : normal
                }
              >
                Kids
              </Link>

              <Link
                to="/products?category=accessories"
                className={
                  accessoriesActive
                    ? active
                    : normal
                }
              >
                Accessories
              </Link>

            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-5">

              <Link
                to="/search"
                className="text-xl text-black"
              >
                🔍
              </Link>

              <Link
                to="/wishlist"
                className="relative text-xl text-black"
              >
                ♡

                {wishlistIds.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative text-xl text-black"
              >
                🛒

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/dashboard"
                className="text-xl text-black"
              >
                👤
              </Link>

            </div>

          </div>

        </div>

      </header>

      {/* PAGE */}
      <main>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 mt-20">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex justify-between">

            <div>
              <h2 className="text-xl font-bold">
                STYLEHUB
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Modern fashion for every occasion.
              </p>
            </div>

            <div className="flex gap-6">

              <Link to="/products">
                Shop
              </Link>

              <Link to="/wishlist">
                Wishlist
              </Link>

              <Link to="/cart">
                Cart
              </Link>

              <Link to="/dashboard">
                Account
              </Link>

            </div>

          </div>

          <p className="text-xs text-gray-400 mt-8">
            © 2026 StyleHub. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}