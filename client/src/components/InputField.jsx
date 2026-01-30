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
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder:text-sm"
        required
      />
    </div>
  );
};

export default InputField;
