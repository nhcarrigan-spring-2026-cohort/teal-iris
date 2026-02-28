"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchUsers, LANGUAGES } from "@/lib/api";      
import { UserCard } from "@/components/userCard/userCard";        
import { UserCardSkeleton } from "@/components/userCardSkeleton/userCardSkeleton";

const PAGE_SIZE = 6;

export default function DiscoverPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const speaking = searchParams.get("speaking") ?? "";
  const learning  = searchParams.get("learning")  ?? "";
  const page      = Number(searchParams.get("page") ?? "1");

  const pushParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, String(value));
      }
      router.push(`/discover?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSpeaking = (value: string) => pushParams({ speaking: value, page: 1 });
  const handleLearning  = (value: string) => pushParams({ learning:  value, page: 1 });
  const handleClear     = ()              => pushParams({ speaking: null, learning: null, page: null });
  const handlePage      = (next: number) => pushParams({ page: next });

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["users", { speaking, learning, page }],
    queryFn:  () => fetchUsers({ speaking, learning, page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,   
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;
  const hasFilters = speaking || learning;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-['DM_Sans',sans-serif]">
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Discover Developers</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Find your language exchange or pair-programming partner</p>
          </div>
          {data && (
            <span className="text-xs text-zinc-500 tabular-nums">
              {isFetching ? "Refreshing…" : `${data.total} developer${data.total !== 1 ? "s" : ""} found`}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Speaking</label>
            <select
              value={speaking}
              onChange={(e) => handleSpeaking(e.target.value)}
              className="h-9 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-zinc-200 px-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-500 hover:border-zinc-500 transition-colors min-w-37.5"
            >
              <option value="">Any language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Learning</label>
            <select
              value={learning}
              onChange={(e) => handleLearning(e.target.value)}
              className="h-9 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-zinc-200 px-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-500 hover:border-zinc-500 transition-colors min-w-[150px]"
            >
              <option value="">Any language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={handleClear}
              className="h-9 mt-auto px-4 rounded-lg text-sm border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {isLoading ? (
          <SkeletonGrid />
        ) : data?.users.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className={`transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>

            {/*  Pagination  */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-xs text-zinc-500 tabular-nums">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <span className="text-4xl">🔍</span>
      <p className="text-zinc-300 font-medium">No users found matching your criteria</p>
      <p className="text-zinc-600 text-sm">Try adjusting or clearing your filters</p>
    </div>
  );
}