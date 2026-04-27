"use client";

import {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/utils/utils";

type TabsVariant = "pill" | "underline" | "soft";
type TabsSize = "sm" | "md" | "lg";

type TabsContextValue = {
  activeValue: string;
  setActiveValue: (value: string) => void;
  baseId: string;
  variant: TabsVariant;
  size: TabsSize;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export type TabsProps = {
  children: ReactNode;
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  className?: string;
  variant?: TabsVariant;
  size?: TabsSize;
};

export function Tabs({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
  variant = "pill",
  size = "md",
}: TabsProps) {
  const generatedId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const contextValue = useMemo(
    () => ({
      activeValue,
      setActiveValue: (nextValue: string) => {
        if (!isControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
      baseId: generatedId,
      variant,
      size,
    }),
    [activeValue, generatedId, isControlled, onValueChange, size, variant],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

const listVariantClasses: Record<TabsVariant, string> = {
  pill: "inline-flex w-fit items-center gap-1 rounded-2xl bg-zinc-100 p-1",
  underline: "inline-flex w-fit items-center gap-2 border-b border-zinc-200",
  soft: "inline-flex w-fit items-center gap-1.5 rounded-2xl bg-zinc-50 p-1.5",
};

const triggerBaseClasses =
  "inline-flex items-center justify-center font-medium outline-none transition";

const triggerSizeClasses: Record<TabsSize, string> = {
  sm: "min-w-20 rounded-lg px-3 py-2 text-sm",
  md: "min-w-24 rounded-xl px-4 py-2.5 text-sm",
  lg: "min-w-28 rounded-xl px-5 py-3 text-base",
};

const triggerVariantClasses: Record<
  TabsVariant,
  { active: string; inactive: string; focus: string }
> = {
  pill: {
    active: "bg-white text-zinc-950 shadow-sm",
    inactive: "text-zinc-600 hover:text-zinc-900",
    focus: "focus-visible:ring-2 focus-visible:ring-zinc-900/10",
  },
  underline: {
    active:
      "rounded-none! border-b-2 border-zinc-950 text-zinc-950 shadow-none",
    inactive:
      "rounded-none! border-b-2 border-transparent text-zinc-500 hover:text-zinc-900",
    focus: "focus-visible:ring-2 focus-visible:ring-zinc-900/10",
  },
  soft: {
    active: "bg-zinc-900 text-white shadow-sm",
    inactive: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
    focus: "focus-visible:ring-2 focus-visible:ring-zinc-900/10",
  },
};

const contentSizeClasses: Record<TabsSize, string> = {
  sm: "rounded-2xl p-4",
  md: "rounded-3xl p-6",
  lg: "rounded-3xl p-8",
};

const contentVariantClasses: Record<TabsVariant, string> = {
  pill: "border border-zinc-200 bg-white shadow-sm",
  underline: "border border-zinc-200 bg-white shadow-sm",
  soft: "border border-zinc-100 bg-zinc-50 shadow-sm",
};

export type TabsListProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TabsVariant;
};

export function TabsList({ className, variant, ...props }: TabsListProps) {
  const context = useTabsContext();
  const resolvedVariant = variant ?? context.variant;

  return (
    <div
      role="tablist"
      className={cn(listVariantClasses[resolvedVariant], className)}
      {...props}
    />
  );
}

export type TabsTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  value: string;
  children: ReactNode;
  variant?: TabsVariant;
  size?: TabsSize;
};

export function TabsTrigger({
  value,
  className,
  children,
  onClick,
  variant,
  size,
  ...props
}: TabsTriggerProps) {
  const context = useTabsContext();
  const resolvedVariant = variant ?? context.variant;
  const resolvedSize = size ?? context.size;
  const isActive = context.activeValue === value;
  const triggerId = `${context.baseId}-${value}-trigger`;
  const contentId = `${context.baseId}-${value}-content`;
  const variantClassSet = triggerVariantClasses[resolvedVariant];

  return (
    <button
      type="button"
      role="tab"
      id={triggerId}
      aria-selected={isActive}
      aria-controls={contentId}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        triggerBaseClasses,
        triggerSizeClasses[resolvedSize],
        variantClassSet.focus,
        isActive ? variantClassSet.active : variantClassSet.inactive,
        className,
      )}
      onClick={(event) => {
        context.setActiveValue(value);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  forceMount?: boolean;
  variant?: TabsVariant;
  size?: TabsSize;
};

export function TabsContent({
  value,
  forceMount = false,
  className,
  children,
  variant,
  size,
  ...props
}: TabsContentProps) {
  const context = useTabsContext();
  const resolvedVariant = variant ?? context.variant;
  const resolvedSize = size ?? context.size;
  const isActive = context.activeValue === value;
  const triggerId = `${context.baseId}-${value}-trigger`;
  const contentId = `${context.baseId}-${value}-content`;

  if (!forceMount && !isActive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={contentId}
      aria-labelledby={triggerId}
      hidden={!isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        contentSizeClasses[resolvedSize],
        contentVariantClasses[resolvedVariant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type { TabsSize, TabsVariant };

function useTabsContext() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used within <Tabs />.");
  }

  return context;
}
