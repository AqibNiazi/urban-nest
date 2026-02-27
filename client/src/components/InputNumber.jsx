import React from "react";

const InputNumber = ({ id, min, max, required, onChange, value, label }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        id={id}
        name={id}
        min={min}
        max={max}
        required={required}
        onChange={onChange}
        value={value}
        className="w-24 bg-stone-50 border border-stone-200 text-stone-800 text-sm
                   rounded-xl px-3 py-2.5 text-center
                   focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                   hover:border-stone-300 transition-all duration-200
                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {label && (
        <span className="text-sm font-medium text-stone-600">{label}</span>
      )}
    </div>
  );
};

export default InputNumber;