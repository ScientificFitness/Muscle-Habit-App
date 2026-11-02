import { cn } from "@/lib/cn";

export function ProgressDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-200",
            i + 1 === current && "bg-[var(--orange)] w-6",
            i + 1 < current && "bg-[var(--navy)]",
            i + 1 > current && "bg-[var(--navy)]/20"
          )}
        />
      ))}
    </div>
  );
}
