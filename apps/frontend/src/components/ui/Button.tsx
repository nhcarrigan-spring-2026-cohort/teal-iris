import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-emerald-500 text-white hover:bg-emerald-400"
      : variant === "secondary"
      ? "border border-white/20 bg-white/5 text-white hover:bg-white/10"
      : "text-white/80 hover:text-white";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
