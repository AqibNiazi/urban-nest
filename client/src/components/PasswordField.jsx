import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ eye icons
const PasswordField = ({
  labelfor,
  labeltext,
  name,
  id,
  value,
  onChange,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
  return (
    <div className="relative mb-4">
      <label
        htmlFor={labelfor}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {labeltext}
      </label>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required={required}
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-10 cursor-pointer text-gray-500"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
};

export default PasswordField;
