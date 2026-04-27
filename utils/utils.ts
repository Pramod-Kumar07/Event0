import { type ForwardedRef } from "react";

//function to merge classes
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

//function to merge refs
export function mergeRefs<T>(
  ...refs: Array<ForwardedRef<T> | undefined>
): (value: T | null) => void {
  return (value) => {
    refs.forEach((ref) => setRef(ref, value));
  };
}

export function setRef<T>(ref: ForwardedRef<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}
