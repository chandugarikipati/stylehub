import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ForgotPassword() {
  const { showToast } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast("Password reset link sent to your email!", "success");
  };

  return (
    <div className="pt-24 min-h-screen bg-charcoal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-charcoal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="4" y="12" width="20" height="13" rx="2" stroke="#0A0A0A" strokeWidth="1.5" />
              <path d="M9 12V9a5 5 0 0110 0v3" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="14" cy="18.5" r="1.5" fill="#C9A84C" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">
            {sent ? "Check Your Email" : "Forgot Password?"}
          </h1>
          <p className="text-charcoal-400 text-sm leading-relaxed">
            {sent
              ? `We've sent a password reset link to ${email}. Check your inbox and follow the instructions.`
              : "No worries. Enter your email address and we'll send you a reset link."}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-charcoal-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-charcoal transition-colors"
                required
              />
            </div>
            <button type="submit" className="w-full bg-charcoal text-white py-4 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-charcoal-800 transition-colors">
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="10" stroke="#22C55E" strokeWidth="1.5" />
                <path d="M9 14l3.5 3.5L19 10" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-charcoal-500 mb-6">Didn't receive the email? Check your spam folder or try again.</p>
            <button onClick={() => setSent(false)} className="w-full border border-charcoal-200 text-charcoal py-3 rounded-xl text-sm font-medium hover:border-charcoal transition-colors mb-3">
              Resend Email
            </button>
          </div>
        )}

        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-charcoal-400 hover:text-charcoal transition-colors mt-5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}


