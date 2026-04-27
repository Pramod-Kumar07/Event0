"use client";

import Input from "@/Components/FormComponents/Input";
import Button from "@/Components/UI/Button";
import { useForm } from "react-hook-form";

type SignInFormValues = {
  email: string;
  password: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignInFormValues) => {
    console.log("Sign in values", values, isSubmitted);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
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
          Submit
        </Button>
      </form>
    </main>
  );
}
