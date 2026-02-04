import * as React from "react";

type Option = { code: string; label: string };

type Props = {
  label: string;
  options: readonly Option[];
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({ label, options, error, className = "", ...props }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-200">{label}</label>
      <select
        className={[
          "w-full rounded-lg border bg-slate-900/40 px-3 py-2 text-slate-100 outline-none",
          "border-slate-700 focus:border-teal-400/70",
          error ? "border-red-500 focus:border-red-400" : "",
          className,
        ].join(" ")}
        {...props}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.code} value={o.code}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
