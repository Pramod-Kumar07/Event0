"use client";

import Input from "@/Components/FormComponents/Input";
import Button from "@/Components/UI/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";

type SignInFormValues = {
  firstname: string;
  middlename: string;
  lastname: string;
  contactnumber: string;
  dob: string;
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
      firstname: "",
      lastname: "",
      contactnumber: "",
      dob: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignInFormValues) => {
    console.log("Sign in values", values, isSubmitted);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center">
      <p className="mx-auto">
        Already have an account{" "}
        <Link href={"/signin"} className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-5 space-x-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm grid grid-cols-2"
      >
        <Input
          type="text"
          label="First name"
          placeholder="Jane"
          registration={register("firstname", {
            required: "First name is required",
            pattern: {
              value: /^[A-Za-z]+$/i,
              message: "Enter a valid first name",
            },
          })}
          error={errors.firstname?.message}
        />


        <Input
          type="text"
          label="Last Name"
          placeholder="Doe"
          registration={register("lastname", {
            pattern: {
              value: /^[A-Za-z]+$/i,
              message: "Enter a valid last name",
            },
          })}
          error={errors.lastname?.message}
        />

        <Input
          type="text"
          label="Contact Number"
          placeholder="9876543210"
          registration={register("contactnumber", {
            pattern: {
              value: /^[0-9]*$/,
              message: "Enter a valid contact number",
            },
            minLength: {
              value: 10,
              message: "Enter 10 digits",
            },
            maxLength: {
              value: 10,
              message: "Enter 10 digits",
            },
          })}
          error={errors.contactnumber?.message}
        />

        <Input
          type="date"
          label="DOB"
          placeholder="dd/mm/yyyy"
          registration={register("dob", {
            required: "Email is required",
          })}
          error={errors.dob?.message}
        />

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
        <Button type="submit" fullWidth className="col-span-2">
          Sign up
        </Button>
      </form>
    </main>
  );
}
