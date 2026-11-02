import Image from "next/image";
import { cn } from "@/lib/cn";

/** Official stacked MUSCLE / HABIT wordmark (navy + orange). */
export function BrandLogo({
  className,
  size = "md",
  priority = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}) {
  // Source asset ≈ 857×601 — keep intrinsic aspect, size by height
  const dims =
    size === "sm"
      ? { w: 100, h: 70, className: "h-11 w-auto" }
      : size === "lg"
        ? { w: 220, h: 154, className: "h-24 w-auto sm:h-28" }
        : { w: 140, h: 98, className: "h-14 w-auto" };

  return (
    <Image
      src="/muscle-habit-logo.png"
      alt="Muscle Habit"
      width={dims.w}
      height={dims.h}
      priority={priority}
      className={cn(dims.className, "object-contain", className)}
    />
  );
}
