import Image from "next/image";
import { cn } from "@/lib/cn";

/** Official stacked MUSCLE / HABIT wordmark (navy + orange on white). */
export function BrandLogo({
  className,
  size = "md",
  priority = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}) {
  const dims =
    size === "sm" ? { w: 56, h: 56, className: "h-10 w-10" } :
    size === "lg" ? { w: 160, h: 160, className: "h-28 w-28 sm:h-32 sm:w-32" } :
    { w: 88, h: 88, className: "h-14 w-14" };

  return (
    <Image
      src="/muscle-habit-logo.jpg"
      alt="Muscle Habit"
      width={dims.w}
      height={dims.h}
      priority={priority}
      className={cn(dims.className, "object-contain", className)}
    />
  );
}
