"use client";

import Button from "@/Components/UI/Button";
import Input from "@/Components/FormComponents/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type PasswordResetForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Page() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<PasswordResetForm>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordResetForm) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const response = await res.json();

      if (response.status === 200) {
        setMessage(response.message ?? "Password updated successfully");
        router.push("/signin");
        return;
      }

      setMessage(response.message ?? "Unable to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-950">Reset password</h1>
        <p className="text-zinc-600">
          Update the password directly for any account email.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <Input
          type="email"
          label="Email address"
          placeholder="jane@example.com"
          registration={register("email", {
            required: "Email is required",
          })}
          error={errors.email?.message}
        />

        <Input
          type="password"
          label="New password"
          placeholder="Enter new password"
          registration={register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          error={errors.password?.message}
        />

        <Input
          type="password"
          label="Confirm password"
          placeholder="Confirm new password"
          registration={register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" fullWidth loading={loading}>
          Update password
        </Button>
      </form>

      {message ? <p className="mt-4 text-sm text-zinc-600">{message}</p> : null}

      <p className="mt-4 text-sm text-zinc-600">
        Already remember it?{" "}
        <Link href="/signin" className="text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </main>
  );
}
