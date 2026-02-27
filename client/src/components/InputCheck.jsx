import React from "react";

const InputCheck = ({ id, onChange, checked, label }) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium 
                  cursor-pointer transition-all duration-200 select-none
        ${
          checked
            ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm shadow-amber-100"
            : "bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700"
        }`}
    >
      <input
        type="checkbox"
        id={id}
        onChange={onChange}
        checked={checked}
        className="sr-only" // visually hidden, label handles click
      />
      <span
        className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 shrink-0
          ${
            checked
              ? "bg-amber-500 border-amber-500"
              : "bg-white border-stone-300"
          }`}
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
};

export default InputCheck;