"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/lib/profileSchema";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm({ initialData }: { initialData: ProfileFormValues }) {
  const token = useUserStore((s) => s.token);
  const setUser = useUserStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  const bioValue = watch("bio");

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await api.patch("/users/me", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data); // Update Zustand store
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-6"
    >
      {/* BIO */}
      <div>
        <label className="block font-medium">Bio</label>
        <textarea
          {...register("bio")}
          className="w-full rounded border p-2"
        />
        <div className="text-sm text-gray-500">
          {bioValue?.length || 0}/500
        </div>
        {errors.bio && (
          <p className="text-red-500 text-sm">{errors.bio.message}</p>
        )}
      </div>

      {/* TIMEZONE */}
      <div>
        <label className="block font-medium">Timezone</label>
        <input
          {...register("timezone")}
          className="w-full rounded border p-2"
        />
        {errors.timezone && (
          <p className="text-red-500 text-sm">{errors.timezone.message}</p>
        )}
      </div>

      {/* DISCORD */}
      <div>
        <label>Discord ID</label>
        <input {...register("discord")} className="w-full border p-2" />
      </div>

      {/* ZOOM */}
      <div>
        <label>Zoom ID</label>
        <input {...register("zoom")} className="w-full border p-2" />
      </div>

      <button
        type="submit"
        disabled={!isValid || mutation.isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {mutation.isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
