"use client";

import { cn, mergeRefs } from "@/utils/utils";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type InputSize = "sm" | "md" | "lg";

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "size"> & {
  label?: string;
  hint?: ReactNode;
  error?: ReactNode;
  registration?: UseFormRegisterReturn;
  wrapperClassName?: string;
  labelClassName?: string;
  hintClassName?: string;
  errorClassName?: string;
  inputSize?: InputSize;
};

const sizeClasses: Record<InputSize, string> = {
  sm: "h-10 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    hint,
    error,
    registration,
    wrapperClassName,
    labelClassName,
    hintClassName,
    errorClassName,
    inputSize = "md",
    className,
    required,
    ...props
  },
  ref,
) {
  const inputId = id ?? props.name ?? registration?.name;
  const hintId = hint && inputId ? `${inputId}-hint` : undefined;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const describedBy = [props["aria-describedby"], hintId, errorId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className={cn("text-sm font-medium text-zinc-900", labelClassName)}
        >
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </label>
      ) : null}

      <input
        {...registration}
        {...props}
        id={inputId}
        required={required}
        aria-invalid={error ? "true" : props["aria-invalid"]}
        aria-describedby={describedBy || undefined}
        ref={mergeRefs(ref, registration?.ref)}
        className={cn(
          "w-full rounded-xl border border-zinc-300 bg-white text-zinc-950 outline-none transition",
          "placeholder:text-zinc-400",
          "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
          "focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
            : "",
          sizeClasses[inputSize],
          className,
        )}
      />

      {hint ? (
        <p id={hintId} className={cn("text-sm text-zinc-500", hintClassName)}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className={cn("text-sm text-red-600", errorClassName)}>
          {error}
        </p>
      ) : null}
    </div>
  );
});

export type { InputProps };
export default Input;
