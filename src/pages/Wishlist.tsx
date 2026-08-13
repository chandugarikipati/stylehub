import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlistIds, toggleWishlist, addToCart } = useApp();
  const wishlistProducts = wishlistIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  return (
    <div className="pt-28 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <nav className="flex items-center gap-2 text-xs text-charcoal-400 mb-6">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-charcoal">Wishlist</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">My Wishlist</h1>
            <p className="text-charcoal-400 text-sm mt-1">{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? "s" : ""}</p>
          </div>
          {wishlistProducts.length > 0 && (
            <button
              onClick={() => { wishlistProducts.forEach((p) => addToCart(p, p.sizes[0], p.colors[0], 1)); }}
              className="bg-gold text-charcoal px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gold-dark hover:text-white transition-all hidden sm:block"
            >
              Add All to Cart
            </button>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-charcoal-50 rounded-full flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 33S6 25 6 15a8 8 0 0114-5.2A8 8 0 0134 15c0 10-14 18-14 18z" stroke="#CCCCCC" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-semibold text-charcoal mb-3">Your wishlist is empty</h3>
            <p className="text-charcoal-400 text-sm mb-8 max-w-xs">Save your favourite pieces to come back to them anytime.</p>
            <Link to="/products" className="bg-charcoal text-white px-10 py-4 rounded-xl text-sm font-semibold hover:bg-charcoal-800 transition-colors">
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {wishlistProducts.map((p) => (
                <div key={p.id} className="relative">
                  <ProductCard product={p} />
                  <button
                    onClick={() => addToCart(p, p.sizes[0], p.colors[0], 1)}
                    className="mt-2 w-full border border-charcoal-200 text-charcoal py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-charcoal hover:text-white hover:border-charcoal transition-all"
                  >
                    Move to Cart
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-10 sm:hidden text-center">
              <button
                onClick={() => { wishlistProducts.forEach((p) => addToCart(p, p.sizes[0], p.colors[0], 1)); }}
                className="bg-gold text-charcoal px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider"
              >
                Add All to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


