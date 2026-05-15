"use client";
import Input from "../FormComponents/Input";
import { Venu } from "@/lib/models/venu";
import Button from "../UI/Button";
import { useForm } from "react-hook-form";

function AddVenu() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Venu>({
    defaultValues: {
      name: "",
      address: "",
      state: "",
    },
  });

  const onSubmit = async (values: Venu) => {
    try {
      const res = await fetch("api/venu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const response = await res.json();
      if (response.status === 200) {
        reset();
        console.log("venu added successfully.");
      } else {
        console.log("Something went wrong", response);
      }
    } catch (err) {
      throw err;
    }
  };
  return (
    <div className="max-w-lg mx-auto flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold">Add Venu</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm w-full"
      >
        <Input
          type="text"
          label="Venu Name"
          placeholder="Enter Venu Name"
          registration={register("name", {
            required: "Venu name is required",
          })}
          error={errors.name?.message}
        />
        <Input
          type="text"
          label="Venu Address"
          placeholder="Enter Venu Address"
          registration={register("address", {
            required: "Venu address is required",
          })}
          error={errors.address?.message}
        />
        <Input
          type="text"
          label="Venu State"
          placeholder="Enter Venu State"
          registration={register("state", {
            required: "Venu state is required",
          })}
          error={errors.state?.message}
        />
        <Button type="submit" fullWidth>
          Add
        </Button>
      </form>
    </div>
  );
}

export default AddVenu;
