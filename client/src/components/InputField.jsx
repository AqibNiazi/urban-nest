import React from "react";

const InputField = ({
  labeltext,
  labelfor,
  type,
  name,
  id,
  value,
  defaultValue,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={labelfor}
        className="block mb-1.5 text-sm font-semibold text-stone-700"
      >
        {labeltext}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm 
                   rounded-xl px-4 py-2.5 
                   placeholder:text-stone-400 placeholder:text-sm
                   focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                   hover:border-stone-300
                   transition-all duration-200"
        required
      />
    </div>
  );
};

export default InputField;