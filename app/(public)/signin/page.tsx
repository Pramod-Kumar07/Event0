"use client";

import Input from "@/Components/FormComponents/Input";
import Button from "@/Components/UI/Button";
import type { SignInSchema } from "@/lib/models/user";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {useRouter} from 'next/navigation'

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset
  } = useForm<SignInSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInSchema) => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const response = await res.json();
      if (response.status === 200) {
        reset()
        router.push("/")
      } else {
        console.log("Something went wrong", response);
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center">
      <p className="mx-auto">
        Do not have an account?{" "}
        <Link href={"/register"} className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
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
          label="Password"
          placeholder="Enter your password"
          registration={register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          error={errors.password?.message}
        />

        <Button type="submit" fullWidth>
          Sign in
        </Button>
      </form>
    </main>
  );
}
