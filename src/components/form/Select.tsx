"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

interface Option {
  value: string;
  label: string;
  status?: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  rules?: any;
  name?: string;
  value?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  rules = {},
  name = "",
  value,
  disabled = false,
}) => {

  const methods = useFormContext();

  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  // 🛡️ VERY IMPORTANT SAFETY CHECK
  if (!methods) return null;

  const { register, formState: { errors }, } = methods;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedValue(val);
    onChange(val); // Trigger parent handler
  };

  const finalValue = value !== undefined ? value : selectedValue;

  return (<>
    <select
      {...register(name || "", rules || "")}
      disabled={disabled}
      className={`${disabled && "bg-gray-200"} cursor-pointer h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${finalValue
        ? "text-gray-800 dark:text-white/90"
        : "text-gray-400 dark:text-gray-400"
        } ${className}`}
      value={finalValue}
      onChange={handleChange}
    >
      {/* Placeholder option */}
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>


      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option?.status ? option?.status == "pending" : false}
          className={` ${option?.status == "pending" ? "text-red-300" : ""} ${option?.status == "verified" ? "text-green-700" : ""} dark:bg-gray-900 dark:text-gray-400 cursor-pointer text-gray-800 `}
        >
          {option.label}
          {option?.status && ` (${option.status})`}
        </option>
      ))}

    </select>

    {errors[name] && (
      <p className="mt-1.5 text-xs text-error-500">
        {errors[name]?.message as string}
      </p>
    )}
  </>);
};

export default Select;
