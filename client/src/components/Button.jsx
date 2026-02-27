import React from "react";

const Button = ({ disabled, type, children, className, onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full cursor-pointer font-semibold rounded-xl text-sm px-5 py-2.5 text-center text-white
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                  ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;