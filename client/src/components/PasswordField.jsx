import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordField = ({
  labelfor,
  labeltext,
  name,
  id,
  value,
  onChange,
  placeholder,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={labelfor}
        className="block mb-1.5 text-sm font-semibold text-stone-700"
      >
        {labeltext}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "••••••••"}
          className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm 
                     rounded-xl px-4 py-2.5 pr-11
                     placeholder:text-stone-400
                     focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                     hover:border-stone-300
                     transition-all duration-200"
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 
                     hover:text-stone-600 transition-colors duration-150 p-0.5"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <FaEyeSlash className="w-4 h-4" />
          ) : (
            <FaEye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;