import React from "react";

const InputNumber = ({ id, min, max, required, onChange, value, label }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        id={id}
        min={min}
        max={max}
        required={required}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder:text-sm
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={onChange}
        value={value}
      />
      <p>{label}</p>
    </div>
  );
};

export default InputNumber;
