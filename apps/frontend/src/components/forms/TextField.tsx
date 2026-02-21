import * as React from "react";

type Props = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function TextField({
  label,
  id,
  type = "text",
  placeholder,
  error,
  className = "",
  ...props
}: Props) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-200 cursor-pointer"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={[
          "w-full rounded-lg border bg-slate-900/40 px-3 py-2 text-slate-100 outline-none",
          "border-slate-700 focus:border-teal-400/70",
          error ? "border-red-500 focus:border-red-400" : "",
          className,
        ].join(" ")}
        {...props}
      />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
