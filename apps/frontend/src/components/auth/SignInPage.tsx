"use client";

import Link from "next/link";
import { useState } from "react";
import Google from "../ui/icons/Google";

export function SignInPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("UI-only sign in:", { userId, password });
    // No API call on purpose
  }

  function onGoogleSignIn(e: React.FormEvent) {
    e.preventDefault();

    // Redirect to Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }

  const disabled = userId.trim().length === 0 || password.trim().length === 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/30 p-6 shadow-lg">
          <h1 className="text-2xl font-semibold">Sign In</h1>
          <p className="mt-2 text-sm text-slate-300">
            Enter your User ID and password to continue.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label
                htmlFor="userId"
                className="cursor-pointer text-sm font-medium text-slate-200"
              >
                User ID
              </label>
              <input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="your_user_id"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 outline-none focus:border-teal-400/70"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="cursor-pointer text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 outline-none focus:border-teal-400/70"
              />
            </div>

            <button
              type="submit"
              disabled={disabled}
              className="relative flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-2.5 font-medium text-slate-950 shadow-md hover:bg-slate-50 hover:shadow-lg transition-shadow duration-150"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="relative w-full rounded-lg bg-white px-4 py-2.5 font-medium text-slate-950 hover:bg-white opacity-60 hover:opacity-90 flex items-center justify-center gap-3"
            >
              <Google />
              Continue with Google
            </button>

            <p className="pt-1 text-center text-sm text-slate-300">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-teal-300 underline underline-offset-4 hover:text-teal-200"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
