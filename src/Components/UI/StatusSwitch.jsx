import React from "react";

const StatusSwitch = ({ checked, onChange, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition
        ${checked ? "bg-green-500" : "bg-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
};

export default StatusSwitch;
