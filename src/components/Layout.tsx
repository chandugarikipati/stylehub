import {
  useState,
  useEffect,
} from "react";

import {
  Outlet,
  Link,
  useLocation,
} from "react-router-dom";

import { useApp } from "../context/AppContext";

export default function Layout() {
  const {
    cartCount,
    wishlistIds,
  } = useApp();

  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const pathname =
    location.pathname;

  const params =
    new URLSearchParams(
      location.search
    );

  const category =
    params.get("category");

  // =====================================================
  // ACTIVE NAVIGATION
  // =====================================================

  const homeActive =
    pathname === "/";

  const shopActive =
    pathname === "/products" &&
    !category;

  const womenActive =
    pathname === "/products" &&
    category === "women";

  const menActive =
    pathname === "/products" &&
    category === "men";

  const kidsActive =
    pathname === "/products" &&
    category === "kids";

  const accessoriesActive =
    pathname === "/products" &&
    category === "accessories";

  // =====================================================
  // CLOSE MOBILE MENU WHEN ROUTE CHANGES
  // =====================================================

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [
    pathname,
    location.search,
  ]);

  // =====================================================
  // DESKTOP NAV STYLES
  // =====================================================

  const active =
    "bg-black text-white font-bold px-4 py-2.5 rounded-lg transition-all";

  const normal =
    "text-black font-medium px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all";

  // =====================================================
  // ICON COMPONENTS
  // =====================================================

  const SearchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );

  const HeartIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path
        d="M20.8 8.8c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"
      />
    </svg>
  );

  const CartIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />

      <circle
        cx="10"
        cy="20"
        r="1"
      />

      <circle
        cx="18"
        cy="20"
        r="1"
      />
    </svg>
  );

  const UserIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
      />

      <path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5" />
    </svg>
  );

  const MenuIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );

  const ArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );

  // =====================================================
  // MOBILE NAV ITEM
  // =====================================================

  const MobileNavLink = ({
    to,
    label,
    active: isActive,
  }: {
    to: string;
    label: string;
    active: boolean;
  }) => (
    <Link
      to={to}
      className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
        isActive
          ? "bg-black text-white"
          : "text-black hover:bg-gray-100"
      }`}
    >
      <span>{label}</span>

      <ArrowIcon />
    </Link>
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="h-16 sm:h-20 flex items-center justify-between">

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold text-black tracking-tight shrink-0"
            >
              STYLEHUB
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav className="hidden lg:flex items-center gap-1">

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

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="flex items-center gap-3 sm:gap-5">

              {/* SEARCH */}

              <Link
                to="/search"
                aria-label="Search"
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-black hover:bg-gray-100 transition-colors"
              >
                <SearchIcon />
              </Link>

              {/* WISHLIST */}

              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative flex items-center justify-center w-9 h-9 rounded-full text-black hover:bg-gray-100 transition-colors"
              >
                <HeartIcon />

                {wishlistIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistIds.length >
                    99
                      ? "99+"
                      : wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* CART */}

              <Link
                to="/cart"
                aria-label="Shopping cart"
                className="relative flex items-center justify-center w-9 h-9 rounded-full text-black hover:bg-gray-100 transition-colors"
              >
                <CartIcon />

                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}
              </Link>

              {/* ACCOUNT - DESKTOP */}

              <Link
                to="/dashboard"
                aria-label="Account"
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-black hover:bg-gray-100 transition-colors"
              >
                <UserIcon />
              </Link>

              {/* MOBILE MENU BUTTON */}

              <button
                type="button"
                aria-label={
                  mobileMenuOpen
                    ? "Close menu"
                    : "Open menu"
                }
                aria-expanded={
                  mobileMenuOpen
                }
                onClick={() =>
                  setMobileMenuOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <CloseIcon />
                ) : (
                  <MenuIcon />
                )}
              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

              <nav className="space-y-1">

                <MobileNavLink
                  to="/"
                  label="Home"
                  active={homeActive}
                />

                <MobileNavLink
                  to="/products"
                  label="Shop"
                  active={shopActive}
                />

                <MobileNavLink
                  to="/products?category=women"
                  label="Women"
                  active={womenActive}
                />

                <MobileNavLink
                  to="/products?category=men"
                  label="Men"
                  active={menActive}
                />

                <MobileNavLink
                  to="/products?category=kids"
                  label="Kids"
                  active={kidsActive}
                />

                <MobileNavLink
                  to="/products?category=accessories"
                  label="Accessories"
                  active={accessoriesActive}
                />

                {/* MOBILE SEARCH */}

                <Link
                  to="/search"
                  className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-medium text-black hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <SearchIcon />
                    Search
                  </span>

                  <ArrowIcon />
                </Link>

                {/* MOBILE WISHLIST */}

                <Link
                  to="/wishlist"
                  className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-medium text-black hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HeartIcon />
                    Wishlist

                    {wishlistIds.length >
                      0 && (
                      <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {wishlistIds.length}
                      </span>
                    )}
                  </span>

                  <ArrowIcon />
                </Link>

                {/* MOBILE CART */}

                <Link
                  to="/cart"
                  className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-medium text-black hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <CartIcon />
                    Cart

                    {cartCount > 0 && (
                      <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </span>

                  <ArrowIcon />
                </Link>

                {/* MOBILE ACCOUNT */}

                <Link
                  to="/dashboard"
                  className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-medium text-black hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <UserIcon />
                    Account
                  </span>

                  <ArrowIcon />
                </Link>

              </nav>

            </div>

          </div>
        )}

      </header>

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <main className="min-w-0">
        <Outlet />
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-gray-200 mt-16 sm:mt-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">

            {/* BRAND */}

            <div className="max-w-sm">

              <h2 className="text-xl font-bold">
                STYLEHUB
              </h2>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                Modern fashion for every
                occasion.
              </p>

            </div>

            {/* FOOTER LINKS */}

            <div className="grid grid-cols-2 sm:flex gap-x-8 gap-y-3">

              <Link
                to="/products"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Shop
              </Link>

              <Link
                to="/wishlist"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Wishlist
              </Link>

              <Link
                to="/cart"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Cart
              </Link>

              <Link
                to="/dashboard"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Account
              </Link>

            </div>

          </div>

          <div className="border-t border-gray-100 mt-8 pt-6">

            <p className="text-xs text-gray-400">
              © 2026 StyleHub. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}