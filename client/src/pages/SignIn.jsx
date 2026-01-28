import React, { useState } from "react";
import { clientBaseURL, clientEndPoints } from "@/config";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "@/store/user/userSlice";
import { Button, InputField, PasswordField, OAuth } from "@/components";
import { notify } from "@/util/notify";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      dispatch(signInStart());
      const response = await clientBaseURL.post(
        clientEndPoints.signin,
        formData,
      );

      if (response.data.success) {
        notify.success(response.data.message);
        dispatch(signInSuccess(response?.data?.data));
        setFormData({ email: "", password: "" }); // reset form
        navigate("/");
      } else {
        notify.error(response.data.message || "Signin failed");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <section className="flex flex-col items-center justify-center px-6 py-12 mx-auto">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign In
          </h1>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <InputField
              labeltext="Email"
              labelfor="email"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
            />

            <PasswordField
              labeltext="Password"
              labelfor="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="************"
              required
            />

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className=" bg-blue-600 hover:bg-blue-700 "
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
            <OAuth />

            {/* Login link */}
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Sign Up
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

export default SignIn;
