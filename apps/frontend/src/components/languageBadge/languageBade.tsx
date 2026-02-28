type BadgeVariant = "speaking" | "learning";

interface LanguageBadgeProps {
  language: string;
  proficiency: string;
  variant: BadgeVariant;
}

const PROFICIENCY_COLORS: Record<string, string> = {
  native:      "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  fluent:      "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  intermediate:"bg-amber-500/15 text-amber-300 ring-amber-500/30",
  beginner:    "bg-rose-500/15 text-rose-300 ring-rose-500/30",
};

const VARIANT_LABEL: Record<BadgeVariant, string> = {
  speaking: "🗣",
  learning:  "📖",
};

export function LanguageBadge({ language, proficiency, variant }: LanguageBadgeProps) {
  const colorClass =
    PROFICIENCY_COLORS[proficiency.toLowerCase()] ??
    "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${colorClass}`}
    >
      <span>{VARIANT_LABEL[variant]}</span>
      <span>{language}</span>
      <span className="opacity-60">· {proficiency}</span>
    </span>
  );
}