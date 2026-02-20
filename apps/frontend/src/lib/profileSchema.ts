import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be 500 characters or less").optional().default(""),
  timezone: z.string().min(1, "Timezone is required"),
  discord: z.string().optional().default(""),
  zoom: z.string().optional().default(""),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
