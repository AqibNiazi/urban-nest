import { clientBaseURL, clientEndPoints } from "@/config";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ eye icons
import OAuth from "@/components/OAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await clientBaseURL.post(
        clientEndPoints.signup,
        formData
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ username: "", email: "", password: "" }); // reset form
        navigate("/sign-in");
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center px-6 py-12 mx-auto">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
          </h1>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                User Name
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="aqib javed"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>

            {/* Password with eye toggle */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer text-white bg-blue-600 hover:bg-blue-700 
                focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 
                dark:focus:ring-blue-800"
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
            <OAuth />

            {/* Login link */}
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Sign In
              </Link>
            </p>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-sm font-medium text-center">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;