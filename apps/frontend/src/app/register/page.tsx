"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { LANGUAGES } from "../src/lib/languages";
import { TextField } from "../src/components/forms/TextField";
import { SelectField } from "../src/components/forms/SelectField";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    nativeLanguage: z.string().min(1, "Native language is required"),
    targetLanguage: z.string().min(1, "Target language is required"),
  })
  .refine((data) => data.nativeLanguage !== data.targetLanguage, {
    message: "Native and target language must be different",
    path: ["targetLanguage"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      nativeLanguage: "",
      targetLanguage: "",
    },
  });

  async function onSubmit(values: RegisterForm) {
    // API not ready yet per issue — keep it UI-only for now.
    // You can log to verify behavior locally.
    console.log("register submit", values);
  }

  return (
    <main className="min-h-[calc(100vh-0px)] bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center md:py-20">
        {/* Left panel (wireframe-style intro) */}
        <section className="md:w-1/2">
          <p className="text-teal-300/90">Create an account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Register and choose your languages
          </h1>
          <p className="mt-4 max-w-prose text-slate-300">
            Find language partners faster by telling us what you speak and what you want to learn.
          </p>
        </section>

        {/* Form card */}
        <section className="md:w-1/2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 shadow-lg md:p-8">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="First Name"
                  placeholder="Azam"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <TextField
                  label="Last Name"
                  placeholder="Jiva"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>

              <TextField
                label="Email"
                type="email"
                placeholder="you@email.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <TextField
                label="Password"
                type="password"
                placeholder="********"
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <SelectField
                  label="Native Language"
                  options={LANGUAGES}
                  error={errors.nativeLanguage?.message}
                  {...register("nativeLanguage")}
                />
                <SelectField
                  label="Target Language"
                  options={LANGUAGES}
                  error={errors.targetLanguage?.message}
                  {...register("targetLanguage")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-lg bg-teal-500 px-4 py-2.5 font-medium text-slate-950 hover:bg-teal-400 disabled:opacity-60"
              >
                {isSubmitting ? "Signing up…" : "Sign Up"}
              </button>

              <p className="pt-2 text-center text-sm text-slate-300">
                Already have an account?{" "}
                <Link className="text-teal-300 hover:text-teal-200 underline underline-offset-4" href="/login">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
