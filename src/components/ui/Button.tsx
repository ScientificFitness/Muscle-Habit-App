import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--orange)] disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        variant === "primary" &&
          "bg-[var(--orange)] text-white hover:brightness-110 rounded-md",
        variant === "secondary" &&
          "bg-[var(--navy)] text-white hover:bg-[var(--navy-deep)] rounded-md",
        variant === "outline" &&
          "border border-[var(--navy)]/20 text-[var(--navy)] hover:border-[var(--navy)]/40 bg-white/70 rounded-md",
        variant === "ghost" &&
          "text-[var(--navy)] hover:bg-[var(--navy)]/5 rounded-md",
        className
      )}
      {...props}
    />
  );
});
