import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useApp } from "../context/AppContext";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID as
    | string
    | undefined;

type GoogleCredentialResponse = {
  credential: string;
};

type GoogleButtonOptions = {
  theme?: string;
  size?: string;
  width?: number;
  text?: string;
  shape?: string;
};

type GoogleIdentityServices = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (
          response: GoogleCredentialResponse
        ) => void;
      }) => void;

      renderButton: (
        parent: HTMLElement,
        options: GoogleButtonOptions
      ) => void;

      disableAutoSelect?: () => void;

      revoke?: (
        hint: string,
        callback?: () => void
      ) => void;
    };
  };
};

function getGoogle():
  | GoogleIdentityServices
  | undefined {
  return (
    window as Window & {
      google?: GoogleIdentityServices;
    }
  ).google;
}

export default function Login() {
  const navigate = useNavigate();

  const {
    login,
    googleLogin,
  } = useApp();

  const googleButtonRef =
    useRef<HTMLDivElement>(null);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error(
        "VITE_GOOGLE_CLIENT_ID is missing."
      );

      return;
    }

    let cancelled = false;

    const setupGoogle = () => {
      if (cancelled) return;

      const google = getGoogle();

      if (
        !google ||
        !googleButtonRef.current
      ) {
        return;
      }

      googleButtonRef.current.innerHTML =
        "";

      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,

          callback: async (
            response
          ) => {
            if (
              !response ||
              !response.credential
            ) {
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
                navigate("/");
              } else {
                setError(
                  "Google login failed. Please try again."
                );
              }
            } catch (err) {
              console.error(
                "Google sign-in error:",
                err
              );

              setError(
                err instanceof Error
                  ? err.message
                  : "Google login failed. Please try again."
              );
            } finally {
              setGoogleLoading(false);
            }
          },
        });

        google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "outline",
            size: "large",
            width: 350,
            text: "continue_with",
            shape: "rectangular",
          }
        );
      } catch (err) {
        console.error(
          "Google button error:",
          err
        );

        setError(
          "Unable to initialize Google Sign-In."
        );
      }
    };

    const google = getGoogle();

    if (google) {
      setupGoogle();

      return () => {
        cancelled = true;
      };
    }

    const scriptId =
      "google-identity-services";

    const existingScript =
      document.getElementById(scriptId);

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        setupGoogle
      );

      return () => {
        cancelled = true;

        existingScript.removeEventListener(
          "load",
          setupGoogle
        );
      };
    }

    const script =
      document.createElement("script");

    script.id = scriptId;

    script.src =
      "https://accounts.google.com/gsi/client";

    script.async = true;
    script.defer = true;

    script.onload = setupGoogle;

    script.onerror = () => {
      setError(
        "Unable to load Google Sign-In. Check your internet connection."
      );
    };

    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [googleLogin, navigate]);

  // =====================================================
  // EMAIL LOGIN
  // =====================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    const cleanEmail =
      email.trim();

    if (
      !cleanEmail ||
      !password
    ) {
      setError(
        "Please enter email and password."
      );

      return;
    }

    try {
      setLoading(true);

      const result =
        await login(
          cleanEmail,
          password
        );

      if (!result) {
        setError(
          "Incorrect email or password."
        );

        return;
      }

      // Go to HOME after successful login
      navigate("/");
    } catch (err: unknown) {
      console.error(
        "Login failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EYE ICONS
  // =====================================================

  const EyeIcon = () => {
    if (showPassword) {
      // Eye with slash = password currently visible
      return (
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
          <path d="M3 3l18 18" />

          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

          <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.2 0 8.7 4 10 8-0.4 1.3-1.2 2.6-2.2 3.7" />

          <path d="M6.2 6.2C4.5 7.4 3.3 9.1 2 12c1.3 4 4.8 8 10 8 1.7 0 3.2-.4 4.5-1" />
        </svg>
      );
    }

    // Normal eye = password hidden
    return (
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
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

        <circle
          cx="12"
          cy="12"
          r="3"
        />
      </svg>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* LOGO */}

        <div className="text-center mb-8">

          <Link
            to="/"
            className="text-3xl font-bold text-charcoal"
          >
            StyleHub
          </Link>

          <h1 className="text-2xl font-semibold mt-6">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your StyleHub account
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

        {/* GOOGLE LOGIN */}

        <div className="flex justify-center min-h-[44px]">

          {GOOGLE_CLIENT_ID ? (
            <div
              ref={googleButtonRef}
              className="min-h-[44px]"
            />
          ) : (
            <p className="text-sm text-red-500 text-center">
              Google login is not configured.
              Check your frontend .env file.
            </p>
          )}

        </div>

        {googleLoading && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Signing in with Google...
          </p>
        )}

        {/* DIVIDER */}

        <div className="flex items-center gap-4 my-6">

          <div className="h-px bg-gray-200 flex-1" />

          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
            OR LOGIN WITH EMAIL
          </span>

          <div className="h-px bg-gray-200 flex-1" />

        </div>

        {/* EMAIL LOGIN */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(
                  e.target.value
                );

                setError("");
              }}
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black transition"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) => {
                  setPassword(
                    e.target.value
                  );

                  setError("");
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-14 outline-none focus:border-black transition"
              />

              {/* PASSWORD VISIBILITY BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black px-2 py-1 transition-colors"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                title={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                <EyeIcon />
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={
              loading ||
              googleLoading
            }
            className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* REGISTER */}

        <p className="text-center text-sm text-gray-500 mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-black font-semibold hover:text-gray-600"
          >
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}