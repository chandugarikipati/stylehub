import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import OrderTracking from "./pages/OrderTracking";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "products", Component: Products },
      { path: "products/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "dashboard", Component: Dashboard },
      { path: "admin", Component: Admin },
      { path: "search", Component: Search },
      { path: "wishlist", Component: Wishlist },
      { path: "order-tracking", Component: OrderTracking },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
]);


