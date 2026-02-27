import React, { useState } from "react";
import { clientBaseURL, clientEndPoints } from "@/config";
import { Link, useNavigate } from "react-router-dom";
import { Button, InputField, PasswordField, OAuth } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import {
  signoutUserFailure,
  signUpStart,
  signUpSuccess,
} from "@/store/user/userSlice";
import { notify } from "@/util/notify";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state) => state.user);

  // ✅ Handle input changes — UNCHANGED
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle form submit — UNCHANGED
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signUpStart());

      const response = await clientBaseURL.post(
        clientEndPoints.signup,
        formData,
      );

      if (response.data.success) {
        notify.success(response.data.message);
        dispatch(signUpSuccess(response.data.data));
        setFormData({ username: "", email: "", password: "" });
        navigate("/sign-in");
      } else {
        notify.error(response.data.message || "Signup failed");
      }
    } catch (err) {
      dispatch(
        signoutUserFailure(
          err.response?.data?.message || "Something went wrong",
        ),
      );
      notify.error(err.response?.data?.message || "Signup failed");
    }
  };

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

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-stone-800 tracking-tight">
                Create your account
              </h1>
              <p className="text-sm text-stone-500 mt-1.5">
                Join thousands of property seekers today
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <InputField
                labeltext="Username"
                labelfor="username"
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. johndoe"
                required
              />

              <InputField
                labeltext="Email address"
                labelfor="email"
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

              <PasswordField
                labeltext="Password"
                labelfor="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
              />

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 mt-2"
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
                    Creating account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400 font-medium px-1">
                  or sign up with
                </span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              {/* Google OAuth — UNCHANGED component */}
              <OAuth />

              {/* Switch to sign in */}
              <p className="text-center text-sm text-stone-500 pt-1">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="font-semibold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </form>
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

export default SignUp;