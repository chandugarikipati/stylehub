import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const trendingSearches = ["Blazer", "Summer Dress", "Italian Suit", "Cashmere Sweater", "Leather Bag", "Kids Puffer Jacket"];
const recentSearches = ["Black dress", "Men's trousers", "Silk scarf"];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState(products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  ));

  const doSearch = (q: string) => {
    setQuery(q);
    setSearchParams(q ? { q } : {});
    setResults(
      products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <div className="pt-28 min-h-screen">
      {/* Search bar */}
      <div className="border-b border-charcoal-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="font-display text-4xl font-bold text-charcoal text-center mb-8">Search</h1>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for styles, brands, products..."
              autoFocus
              className="w-full h-14 border-2 border-charcoal-200 rounded-2xl px-6 pr-14 text-base outline-none focus:border-charcoal transition-colors"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal hover:text-gold transition-colors">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 16l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {!query ? (
          /* Empty state / suggestions */
          <div className="max-w-2xl mx-auto">
            {recentSearches.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-4">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => doSearch(s)}
                      className="flex items-center gap-2 border border-charcoal-200 text-charcoal-600 text-sm px-4 py-2 rounded-xl hover:border-charcoal hover:text-charcoal transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M9 9l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-4">Trending Searches</h3>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => doSearch(s)}
                    className="flex items-center gap-2 bg-charcoal-50 text-charcoal text-sm px-4 py-2 rounded-xl hover:bg-charcoal hover:text-white transition-all"
                  >
                    <span className="text-gold">↗</span> {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-2xl font-bold text-charcoal mb-3">No results for "{query}"</h3>
            <p className="text-charcoal-400 text-sm mb-8">Try a different keyword or browse our categories.</p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {trendingSearches.map((s) => (
                <button key={s} onClick={() => doSearch(s)} className="bg-charcoal-50 text-charcoal text-sm px-4 py-2 rounded-xl hover:bg-charcoal hover:text-white transition-all">
                  {s}
                </button>
              ))}
            </div>
            <Link to="/products" className="bg-charcoal text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-charcoal-800 transition-colors">
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-charcoal-500 text-sm">
                <span className="font-semibold text-charcoal">{results.length} results</span> for "{query}"
              </p>
              <button onClick={() => { setQuery(""); setSearchParams({}); setResults([]); }} className="text-sm text-charcoal-400 hover:text-charcoal transition-colors">
                Clear ×
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {results.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


