"use client";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

interface FileInputProps {
  id?: string;
  name?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  hint?: string;
  rules?: any;
  accept?: string;
}

const FileInput: FC<FileInputProps> = ({
  id,
  name = "no-name",
  className = "",
  onChange,
  disabled = false,
  error = false,
  success = false,
  hint,
  rules,
  accept,
}) => {

  const methods = useFormContext();

  // Base classes for the file input
  const baseClasses = `h-11 w-full overflow-hidden rounded-lg border text-sm transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:py-3 file:pl-3.5 file:pr-3 file:text-sm placeholder:text-gray-400 focus:outline-hidden focus:ring-3 shadow-theme-xs ${className}`;

  let semanticClasses = "";
  if (disabled) {
    semanticClasses = "text-gray-500 border-gray-300 cursor-not-allowed bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 file:bg-gray-100 file:text-gray-400 file:border-gray-200";
  }
  // else if (error || (methods && methods.formState.errors[name])) {
  //   semanticClasses = "text-error-800 border-error-500 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500 file:bg-error-50 file:text-error-700 file:border-error-200";
  // } 
  else if (success) {
    semanticClasses = "text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500 file:bg-success-50 file:text-success-700 file:border-success-200";
  } else {
    semanticClasses = "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 file:bg-gray-50 file:text-gray-700 file:border-gray-200 hover:file:bg-gray-100";
  }

  const finalClasses = `${baseClasses} ${semanticClasses}`;

  if (!methods) {
    return (
      <input
        type="file"
        id={id || name}
        className={finalClasses}
        onChange={onChange}
        accept={accept}
        disabled={disabled}
      />
    );
  }

  const { register, formState: { errors }, watch } = methods;
  const { onChange: rhfOnChange, onBlur: rhfOnBlur, ref: rhfRef, name: rhfName } = register(name, rules);
  const isError = error || !!errors[name];

  const watchedValue = watch(name);
  const fileName = watchedValue instanceof FileList ? watchedValue[0]?.name : (watchedValue instanceof File ? watchedValue.name : null);

  return (
    <div className="relative">
      <input
        type="file"
        id={id || name}
        name={rhfName}
        ref={rhfRef}
        accept={accept}
        disabled={disabled}
        className={finalClasses}
        onChange={(e) => {
          rhfOnChange(e);
          if (onChange) onChange(e);
        }}
        onBlur={rhfOnBlur}
      />

      {fileName && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Selected: <span className="font-semibold">{fileName}</span>
        </p>
      )}

      {hint && (
        <p className={`mt-1.5 text-xs ${isError ? "text-error-500" : success ? "text-success-500" : "text-gray-500"}`}>
          {hint}
        </p>
      )}

      {errors[name] && (
        <p className="mt-1.5 text-xs text-error-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default FileInput;
