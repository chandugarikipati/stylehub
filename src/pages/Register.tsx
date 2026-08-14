import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: {
              credential: string;
            }) => void;
          }) => void;

          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
              shape?: string;
            }
          ) => void;
        };
      };
    };
  }
}

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID as
    | string
    | undefined;

export default function Register() {
  const {
    login,
    googleLogin,
    showToast,
  } = useApp();

  const navigate = useNavigate();

  const googleButtonRef =
    useRef<HTMLDivElement>(null);

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // GOOGLE SIGN UP
  // =====================================================

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error(
        "VITE_GOOGLE_CLIENT_ID is missing in frontend .env"
      );

      return;
    }

    const setupGoogle = () => {
      if (
        !window.google ||
        !googleButtonRef.current
      ) {
        return;
      }

      googleButtonRef.current.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,

        callback: async (response) => {
          if (!response.credential) {
            setError(
              "Google did not return a login credential."
            );

            return;
          }

          setError("");
          setGoogleLoading(true);

          try {
            const success =
              await googleLogin(
                response.credential
              );

            if (success) {
              showToast(
                "Google account created successfully!",
                "success"
              );

              navigate("/");
            } else {
              setError(
                "Google account creation/login failed. Please try again."
              );
            }
          } catch (err) {
            console.error(
              "Google registration error:",
              err
            );

            setError(
              "Google account creation failed. Please try again."
            );
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "outline",
          size: "large",
          width: 350,
          text: "signup_with",
          shape: "rectangular",
        }
      );
    };

    if (window.google) {
      setupGoogle();

      return;
    }

    const selector =
      'script[src="https://accounts.google.com/gsi/client"]';

    const existingScript =
      document.querySelector(selector);

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        setupGoogle
      );

      return () => {
        existingScript.removeEventListener(
          "load",
          setupGoogle
        );
      };
    }

    const script =
      document.createElement("script");

    script.src =
      "https://accounts.google.com/gsi/client";

    script.async = true;
    script.defer = true;

    script.onload = setupGoogle;

    script.onerror = () => {
      setError(
        "Unable to load Google Sign-In."
      );
    };

    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [
    googleLogin,
    navigate,
    showToast,
  ]);

  // =====================================================
  // CREATE ACCOUNT
  // =====================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const cleanIdentifier =
      identifier.trim();

    // ---------------------------------------------------
    // REQUIRED
    // ---------------------------------------------------

    if (
      !cleanIdentifier ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please enter your email or mobile number and password."
      );

      return;
    }

    // ---------------------------------------------------
    // EMAIL OR MOBILE VALIDATION
    // ---------------------------------------------------

    const looksLikeEmail =
      cleanIdentifier.includes("@");

    const digits =
      cleanIdentifier.replace(/\D/g, "");

    if (looksLikeEmail) {
      const validEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          cleanIdentifier
        );

      if (!validEmail) {
        setError(
          "Please enter a valid email address."
        );

        return;
      }
    } else {
      if (digits.length !== 10) {
        setError(
          "Please enter a valid 10-digit mobile number."
        );

        return;
      }
    }

    // ---------------------------------------------------
    // PASSWORD
    // ---------------------------------------------------

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    // ---------------------------------------------------
    // REGISTER
    // ---------------------------------------------------

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/users/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            identifier:
              cleanIdentifier,
            password,
          }),
        }
      );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        setError(
          data.message ||
            "Registration failed."
        );

        return;
      }

      showToast(
        "Account created successfully!",
        "success"
      );

      // -------------------------------------------------
      // AUTOMATIC LOGIN
      // -------------------------------------------------

      const loggedIn =
        await login(
          cleanIdentifier,
          password
        );

      if (loggedIn) {
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        "Cannot connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-2">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="hidden lg:flex bg-charcoal text-white min-h-[650px] relative overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-800 to-black" />

          <div className="relative z-10 flex flex-col justify-center p-12">

            <p className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6">
              STYLEHUB
            </p>

            <h2 className="font-display text-5xl font-bold leading-tight mb-6">
              Your style starts here.
            </h2>

            <p className="text-white/70 text-lg leading-relaxed max-w-md mb-8">
              Create your account with just
              an email or mobile number and
              start shopping.
            </p>

            <div className="space-y-4">

              {[
                "Easy checkout",
                "Order tracking",
                "Save favorites",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3"
                >

                  {/* Use SVG instead of an emoji/symbol */}
                  <span className="text-gold text-lg w-5 h-5 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M5 12.5l4 4L19 7" />
                    </svg>
                  </span>

                  <span className="text-white/80 text-sm">
                    {benefit}
                  </span>

                </div>
              ))}

            </div>

          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="p-8 sm:p-12 flex flex-col justify-center">

          <div className="mb-8">

            <Link
              to="/"
              className="font-display text-2xl font-bold text-charcoal"
            >
              StyleHub
            </Link>

            <h1 className="font-display text-3xl font-bold text-charcoal mt-6 mb-2">
              Create Account
            </h1>

            <p className="text-charcoal-400 text-sm">
              Use your email or mobile number.
              You don't need to provide your
              name.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

              <p className="text-sm font-medium text-red-600">
                {error}
              </p>

            </div>
          )}

          {/* GOOGLE */}

          <div className="flex justify-center min-h-[44px]">

            {GOOGLE_CLIENT_ID ? (
              <div
                ref={googleButtonRef}
              />
            ) : (
              <p className="text-sm text-red-500 text-center">
                Google sign up is not
                configured. Check frontend
                .env.
              </p>
            )}

          </div>

          {googleLoading && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Creating your account with
              Google...
            </p>
          )}

          {/* DIVIDER */}

          <div className="flex items-center gap-3 my-6">

            <div className="flex-1 h-px bg-charcoal-100" />

            <span className="text-xs text-charcoal-400">
              OR CREATE WITH EMAIL / MOBILE
            </span>

            <div className="flex-1 h-px bg-charcoal-100" />

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* EMAIL / MOBILE */}

            <div>

              <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
                Email or Mobile Number
              </label>

              <input
                required
                type="text"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="Email or 10-digit mobile number"
                autoComplete="username"
                className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
                Password
              </label>

              <input
                required
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
              />

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>

              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="Repeat your password"
                autoComplete="new-password"
                className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={
                loading ||
                googleLoading
              }
              className="w-full bg-charcoal text-white py-3.5 rounded-xl font-semibold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* LOGIN */}

          <p className="text-center text-sm text-charcoal-400 mt-6">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-charcoal font-semibold hover:text-gold"
            >
              Login
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
}