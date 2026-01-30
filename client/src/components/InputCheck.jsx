import React from "react";

const InputCheck = ({ id, onChange, checked, label }) => {
  return (
    <div className="flex gap-2">
      <input
        type="checkbox"
        id={id}
        className="w-5"
        onChange={onChange}
        checked={checked}
      />
      <span>{label}</span>
    </div>
  );
};

export default InputCheck;
