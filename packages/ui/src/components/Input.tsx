import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className = "", id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-fg-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full px-3 py-2 text-sm border rounded-md",
          "bg-canvas text-fg placeholder:text-fg-muted",
          "focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
          "disabled:bg-surface-2 disabled:text-fg-disabled disabled:cursor-not-allowed",
          error ? "border-error-border" : "border-border",
          className,
        ].join(" ")}
        {...props}
      />
      {hint && !error && <p className="text-xs text-fg-muted">{hint}</p>}
      {error && <p className="text-xs text-error-fg">{error}</p>}
    </div>
  );
}
