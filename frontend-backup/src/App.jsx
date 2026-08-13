import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

const API_URL = "http://localhost:5000";

// ==============================
// LOGIN / REGISTER
// ==============================

function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin
        ? `${API_URL}/api/users/login`
        : `${API_URL}/api/users/register`;

      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Success!");

        if (!isLogin) {
          setName("");
        }

        setEmail("");
        setPassword("");

        // Move to products after successful login/register
        setTimeout(() => {
          navigate("/products");
        }, 500);
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">STYLEHUB</div>

        <p className="brand-subtitle">
          Fashion that defines you
        </p>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        <p className="auth-description">
          {isLogin
            ? "Login to continue shopping"
            : "Join StyleHub and discover your style"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <div className="switch-text">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            className="switch-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? " Register" : " Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// PRODUCT LIST
// ==============================

function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load products");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader"></div>
        <p>Loading StyleHub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>{error}</h2>
        <p>Make sure your backend is running on port 5000.</p>

        <button
          className="primary-button small-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="shop-page">

      {/* HEADER */}

      <header className="shop-header">
        <div
          className="shop-logo"
          onClick={() => navigate("/products")}
        >
          STYLEHUB
        </div>

        <nav>
          <button onClick={() => navigate("/products")}>
            Home
          </button>

          <button>Women</button>
          <button>Men</button>
          <button>Kids</button>
          <button>Accessories</button>
        </nav>

        <div className="header-actions">
          <button className="icon-button">♡</button>
          <button className="icon-button">🛒</button>
        </div>
      </header>

      {/* HERO */}

      <section className="shop-hero">
        <div>
          <p className="hero-small">NEW SEASON</p>

          <h1>
            Discover Your
            <br />
            <span>Perfect Style</span>
          </h1>

          <p>
            Explore premium fashion designed for
            <br />
            every moment.
          </p>

          <button
            className="hero-button"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            SHOP NOW
          </button>
        </div>
      </section>

      {/* PRODUCTS */}

      <main className="products-section" id="products">

        <div className="section-heading">
          <div>
            <p className="section-label">OUR COLLECTION</p>
            <h2>Featured Products</h2>
          </div>

          <p className="product-count">
            {products.length} products
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div
              className="product-card"
              key={product._id}
              onClick={() =>
                navigate(`/product/${product._id}`)
              }
            >

              <div className="product-image-wrapper">

                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />

                {product.discount > 0 && (
                  <span className="discount-badge">
                    -{product.discount}%
                  </span>
                )}

                {(product.newArrival || product.isNew) && (
                  <span className="new-badge">
                    NEW
                  </span>
                )}

                <button
                  className="wishlist-button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  ♡
                </button>
              </div>

              <div className="product-info">

                <p className="product-brand">
                  {product.brand}
                </p>

                <h3>{product.name}</h3>

                <div className="rating">
                  ★ {product.rating}
                  <span>
                    ({product.reviewCount})
                  </span>
                </div>

                <div className="price-row">
                  <strong>
                    ₹{product.price.toLocaleString("en-IN")}
                  </strong>

                  <span className="original-price">
                    ₹
                    {product.originalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}

      <footer className="footer">
        <div className="footer-logo">STYLEHUB</div>

        <p>
          Fashion that defines you.
        </p>

        <p className="copyright">
          © 2026 StyleHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// ==============================
// PRODUCT DETAILS
// ==============================

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.image);

        if (data.sizes?.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

        if (data.colors?.length > 0) {
          setSelectedColor(data.colors[0]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-page">
        <h2>Product not found</h2>

        <button
          className="primary-button small-button"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const productImages = product.images?.length
    ? product.images
    : [product.image];

  return (
    <div className="details-page">

      {/* HEADER */}

      <header className="shop-header">
        <div
          className="shop-logo"
          onClick={() => navigate("/products")}
        >
          STYLEHUB
        </div>

        <nav>
          <button onClick={() => navigate("/products")}>
            Home
          </button>

          <button>Women</button>
          <button>Men</button>
          <button>Kids</button>
          <button>Accessories</button>
        </nav>

        <div className="header-actions">
          <button className="icon-button">♡</button>
          <button className="icon-button">🛒</button>
        </div>
      </header>

      {/* BREADCRUMB */}

      <div className="breadcrumb">
        <button onClick={() => navigate("/products")}>
          Home
        </button>

        <span>/</span>

        <span>{product.category}</span>

        <span>/</span>

        <strong>{product.name}</strong>
      </div>

      {/* PRODUCT DETAILS */}

      <main className="details-container">

        {/* IMAGE SECTION */}

        <div className="details-images">

          <div className="thumbnail-list">

            {productImages.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${
                  selectedImage === image
                    ? "active-thumbnail"
                    : ""
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                />
              </button>
            ))}

          </div>

          <div className="main-product-image">

            <img
              src={selectedImage}
              alt={product.name}
            />

            {product.discount > 0 && (
              <span className="details-discount">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>

        {/* INFO SECTION */}

        <div className="details-info">

          <p className="details-brand">
            {product.brand}
          </p>

          <h1>{product.name}</h1>

          <div className="details-rating">
            <span>★ {product.rating}</span>

            <span>
              {product.reviewCount} reviews
            </span>
          </div>

          <div className="details-price">

            <strong>
              ₹{product.price.toLocaleString("en-IN")}
            </strong>

            <span>
              ₹
              {product.originalPrice.toLocaleString(
                "en-IN"
              )}
            </span>

            <em>
              {product.discount}% OFF
            </em>
          </div>

          <p className="details-description">
            {product.description}
          </p>

          {/* COLORS */}

          {product.colors?.length > 0 && (
            <div className="option-section">

              <h3>
                Color:
                <span>{selectedColor}</span>
              </h3>

              <div className="color-options">
                {product.colors.map((color, index) => (
                  <button
                    key={color}
                    className={`color-option ${
                      selectedColor === color
                        ? "selected-option"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedColor(color)
                    }
                  >
                    {product.colorHex?.[index] ? (
                      <span
                        className="color-circle"
                        style={{
                          backgroundColor:
                            product.colorHex[index],
                        }}
                      />
                    ) : null}

                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE */}

          {product.sizes?.length > 0 && (
            <div className="option-section">

              <h3>
                Size:
                <span>{selectedSize}</span>
              </h3>

              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={
                      selectedSize === size
                        ? "selected-size"
                        : ""
                    }
                    onClick={() =>
                      setSelectedSize(size)
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STOCK */}

          <div className="stock-info">

            {product.inStock ? (
              <>
                <span className="stock-dot"></span>

                <span>
                  In stock
                  {product.stockCount
                    ? ` • ${product.stockCount} available`
                    : ""}
                </span>
              </>
            ) : (
              <span>Out of stock</span>
            )}
          </div>

          {/* BUTTONS */}

          <div className="details-actions">

            <button
              className="add-cart-button"
              disabled={!product.inStock}
              onClick={() => {
                alert(
                  `${product.name} added to cart!`
                );
              }}
            >
              🛒 ADD TO CART
            </button>

            <button className="details-wishlist">
              ♡
            </button>
          </div>

          {/* PRODUCT INFORMATION */}

          <div className="product-extra-info">

            <div>
              <span>Material</span>
              <strong>
                {product.material || "Premium"}
              </strong>
            </div>

            <div>
              <span>Fit</span>
              <strong>
                {product.fit || "Regular"}
              </strong>
            </div>

            <div>
              <span>Category</span>
              <strong>
                {product.category}
              </strong>
            </div>

          </div>

        </div>
      </main>

      <footer className="footer">
        <div className="footer-logo">STYLEHUB</div>

        <p>
          Fashion that defines you.
        </p>

        <p className="copyright">
          © 2026 StyleHub. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

// ==============================
// APP
// ==============================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<AuthPage />}
        />

        <Route
          path="/products"
          element={<ProductsPage />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetailsPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;