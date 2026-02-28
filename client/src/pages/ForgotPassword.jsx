import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { clientBaseURL, clientEndPoints } from "@/config";
import { InputField, PasswordField, Button } from "@/components";
import { notify } from "@/util/notify";

// ─── Step 1: Request reset email ─────────────────────────────────────────────
const RequestStep = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      notify.error("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await clientBaseURL.post(
        clientEndPoints.forgotPassword,
        { email },
      );
      if (response.data.success) {
        notify.success(
          response.data.message || "Reset link sent! Check your inbox.",
        );
        onSuccess(email);
      } else {
        notify.error(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      notify.error(
        err?.response?.data?.message || "Failed to send reset email.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {/* Description */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <svg
          className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-amber-700 leading-relaxed">
          Enter the email address associated with your account and we'll send
          you a link to reset your password.
        </p>
      </div>

      <InputField
        labeltext="Email address"
        labelfor="email"
        type="email"
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 mt-1"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Sending link…
          </span>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <p className="text-center text-sm text-stone-500 pt-1">
        Remembered it?{" "}
        <Link
          to="/sign-in"
          className="font-semibold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
};

// ─── Step 2: "Check your inbox" confirmation ─────────────────────────────────
const EmailSentStep = ({ email, onResend }) => {
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await clientBaseURL.post(
        clientEndPoints.forgotPassword,
        { email },
      );
      if (response.data.success) {
        notify.success("Reset link sent again!");
      } else {
        notify.error(response.data.message || "Failed to resend.");
      }
    } catch (err) {
      notify.error(err?.response?.data?.message || "Failed to resend.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      {/* Envelope illustration */}
      <div className="flex items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-200">
          <svg
            className="w-9 h-9 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-stone-800">Check your inbox</h3>
        <p className="text-sm text-stone-500 mt-2 leading-relaxed max-w-xs mx-auto">
          We've sent a password reset link to{" "}
          <span className="font-semibold text-stone-700">{email}</span>
        </p>
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left space-y-2">
        {[
          "Check your spam or junk folder.",
          "The link expires in 1 hour.",
          "Click the link in the email to set a new password.",
        ].map((tip, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-stone-600">{tip}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-xs text-stone-400">
          Didn't receive the email?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold text-amber-600 hover:text-amber-700 hover:underline disabled:opacity-60 transition-colors"
          >
            {resending ? "Sending…" : "Resend it"}
          </button>
        </p>
        <Link
          to="/sign-in"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

// ─── Step 3: Reset password form (token from URL) ─────────────────────────────
const ResetStep = ({ token }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      notify.error("Password is required.");
      return;
    }
    if (formData.password.length < 6) {
      notify.error("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      notify.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await clientBaseURL.post(clientEndPoints.resetPassword, {
        token,
        password: formData.password,
      });
      if (response.data.success) {
        notify.success(response.data.message || "Password reset successfully!");
        setDone(true);
      } else {
        notify.error(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      notify.error(
        err?.response?.data?.message ||
          "Reset link may have expired. Request a new one.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-200">
            <svg
              className="w-9 h-9 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-stone-800">
            Password updated!
          </h3>
          <p className="text-sm text-stone-500 mt-2">
            Your password has been reset successfully. You can now sign in with
            your new password.
          </p>
        </div>
        <Link
          to="/sign-in"
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-bold text-white
                     bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl
                     shadow-lg shadow-amber-200 hover:shadow-amber-300
                     hover:from-amber-600 hover:to-orange-600
                     transition-all duration-200 hover:-translate-y-0.5"
        >
          Continue to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <PasswordField
        labeltext="New Password"
        labelfor="password"
        name="password"
        id="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Min. 6 characters"
        required
      />

      <PasswordField
        labeltext="Confirm New Password"
        labelfor="confirmPassword"
        name="confirmPassword"
        id="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        required
      />

      {/* Password match indicator */}
      {formData.confirmPassword && (
        <div
          className={`flex items-center gap-2 text-xs font-medium ${formData.password === formData.confirmPassword ? "text-green-600" : "text-red-500"}`}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            {formData.password === formData.confirmPassword ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            )}
          </svg>
          {formData.password === formData.confirmPassword
            ? "Passwords match"
            : "Passwords do not match"}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 mt-1"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Resetting…
          </span>
        ) : (
          "Set New Password"
        )}
      </Button>

      <p className="text-center text-sm text-stone-500">
        <Link
          to="/sign-in"
          className="font-semibold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
        >
          ← Back to Sign In
        </Link>
      </p>
    </form>
  );
};

// ─── Page wrapper ─────────────────────────────────────────────────────────────
const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // /forgot-password?token=abc123

  const [step, setStep] = useState("request"); // "request" | "sent"
  const [sentEmail, setSentEmail] = useState("");

  // Determine which view to render
  const renderContent = () => {
    // If token param is present → we came from the email link → show reset form
    if (token) {
      return {
        title: "Set new password",
        subtitle: "Choose a strong password for your account",
        content: <ResetStep token={token} />,
        step: 3,
      };
    }
    if (step === "sent") {
      return {
        title: "Email sent",
        subtitle: "We've dispatched your reset link",
        content: (
          <EmailSentStep
            email={sentEmail}
            onResend={() => setStep("request")}
          />
        ),
        step: 2,
      };
    }
    return {
      title: "Forgot password?",
      subtitle: "No worries, we'll help you recover access",
      content: (
        <RequestStep
          onSuccess={(email) => {
            setSentEmail(email);
            setStep("sent");
          }}
        />
      ),
      step: 1,
    };
  };

  const { title, subtitle, content, step: currentStep } = renderContent();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50/40 px-4 py-12">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-stone-100/60 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl shadow-stone-300/40 border border-white/60 overflow-hidden">
          {/* Gradient top bar */}
          <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

          <div className="px-8 py-10">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight text-stone-800">
                Urban<span className="text-amber-500">Nest</span>
              </span>
            </div>

            {/* Progress dots — only shown on request/sent steps */}
            {!token && (
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentStep >= s
                        ? "w-8 bg-gradient-to-r from-amber-400 to-orange-500"
                        : "w-4 bg-stone-200"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Lock icon + heading */}
            <div className="text-center mb-8">
              {/* Small lock icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 mb-4">
                <svg
                  className="w-6 h-6 text-amber-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  {token ? (
                    <path d="M15 7h-1V5a3 3 0 00-6 0v2H7a1 1 0 00-1 1v9a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1zm-6 0V5a1 1 0 012 0v2H9z" />
                  ) : (
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  )}
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-stone-800 tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-stone-500 mt-1.5">{subtitle}</p>
            </div>

            {/* Step content */}
            {content}
          </div>
        </div>

        {/* Trust badge */}
        <p className="text-center text-xs text-stone-400 mt-5 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          Secured with 256-bit encryption
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
