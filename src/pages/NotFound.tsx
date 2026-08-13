import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="pt-28 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-8xl font-bold text-charcoal-100 leading-none mb-2">404</p>
        <h1 className="font-display text-3xl font-bold text-charcoal mb-3">Page Not Found</h1>
        <p className="text-charcoal-400 text-sm leading-relaxed mb-10">
          The page you're looking for seems to have wandered off. Perhaps it's trying on a new collection.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/"
            className="bg-charcoal text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-charcoal-800 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/products"
            className="border border-charcoal-200 text-charcoal px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:border-charcoal transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}


