import { LanguageBadge } from "../languageBadge/languageBade";

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  speaking: { language: string; proficiency: string }[];
  learning:  { language: string; proficiency: string }[];
  timezoneOffsetHours: number; 
}

function formatOffset(hours: number): string {
  if (hours === 0) return "Same timezone";
  const abs = Math.abs(hours);
  const label = abs === 1 ? "hour" : "hours";
  return hours > 0 ? `${abs} ${label} ahead` : `${abs} ${label} behind`;
}

export function UserCard({ user }: { user: UserProfile }) {
  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl bg-zinc-900 border border-zinc-800 p-5 hover:border-zinc-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-700 group-hover:ring-zinc-500 transition-all"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-zinc-900" />
        </div>
        <div>
          <p className="font-semibold text-zinc-100 text-sm leading-tight">{user.name}</p>
          <p className="text-xs text-zinc-500 mt-0.5">🕐 {formatOffset(user.timezoneOffsetHours)}</p>
        </div>
      </div>

      <div className="h-px bg-zinc-800" />

      <div className="flex flex-col gap-2">
        {user.speaking.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {user.speaking.map((s) => (
              <LanguageBadge key={s.language} language={s.language} proficiency={s.proficiency} variant="speaking" />
            ))}
          </div>
        )}
        {user.learning.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {user.learning.map((l) => (
              <LanguageBadge key={l.language} language={l.language} proficiency={l.proficiency} variant="learning" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}