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
      dispatch(signUpStart());

      const response = await clientBaseURL.post(
        clientEndPoints.signup,
        formData,
      );

      if (response.data.success) {
        notify.success(response.data.message);
        dispatch(signUpSuccess(response.data.data));
        setFormData({ username: "", email: "", password: "" }); // reset form
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
    <section className="flex flex-col items-center justify-center px-6 py-12 mx-auto">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
          </h1>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {/* Username */}

            <InputField
              labeltext="Username"
              labelfor="username"
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="aqib javed"
              required
            />

            {/* Email */}

            <InputField
              labeltext="Email"
              labelfor="email"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <PasswordField
              labeltext="Password"
              labelfor="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className=" text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>
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
