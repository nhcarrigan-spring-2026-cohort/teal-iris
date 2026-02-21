"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { useUserStore } from "../../store/useUserStore";

const profileSchema = z.object({
  bio: z.string().max(500, "Bio cannot exceed 500 characters"),
  timezone: z.string().min(1, "Timezone is required"),
  discord: z.string().optional(),
  zoom: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const token = useUserStore((s) => s.token);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      timezone: "",
      discord: "",
      zoom: "",
    },
    mode: "onChange",
  });

  const bioValue = useWatch({
    control: form.control,
    name: "bio",
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await api.patch("/users/me", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error: unknown) => {
      let message = "Update failed";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    },
  });

  if (!token) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Profile Settings</h1>

      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div>
          <label className="block font-medium">Bio</label>
          <textarea
            {...form.register("bio")}
            className="w-full border rounded p-2"
          />
          <div className="text-sm text-gray-500">
            {bioValue?.length ?? 0}/500
          </div>
          {form.formState.errors.bio && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.bio.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium">Timezone</label>
          <input
            {...form.register("timezone")}
            className="w-full border rounded p-2"
          />
          {form.formState.errors.timezone && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.timezone.message}
            </p>
          )}
        </div>

        <div>
          <label>Discord ID</label>
          <input
            {...form.register("discord")}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label>Zoom ID</label>
          <input
            {...form.register("zoom")}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={!form.formState.isValid || mutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}