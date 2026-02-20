"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useUserStore } from "@/store/useUserStore";
import { ProfileForm } from "@/components/profile/ProfileForm";

export function ProfileClient() {
  const router = useRouter();
  const token = useUserStore((s) => s.token);

  const { data, isLoading, isError, error } = useProfile();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  if (!token) return null;

  if (isLoading) return <div className="p-6">Loading profile…</div>;

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load profile: {(error as any)?.message ?? "Unknown error"}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <ProfileForm initialData={data} />
    </div>
  );
}
