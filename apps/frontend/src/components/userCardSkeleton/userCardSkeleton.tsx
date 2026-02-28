export function UserCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-zinc-900 border border-zinc-800 p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-zinc-800" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-28 rounded bg-zinc-800" />
          <div className="h-2.5 w-20 rounded bg-zinc-800" />
        </div>
      </div>
      <div className="h-px bg-zinc-800" />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-zinc-800" />
          <div className="h-5 w-24 rounded-full bg-zinc-800" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-zinc-800" />
          <div className="h-5 w-20 rounded-full bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}