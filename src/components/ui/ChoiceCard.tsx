import { cn } from "@/lib/cn";

export function ChoiceCard({
  selected,
  title,
  description,
  onClick,
}: {
  selected?: boolean;
  title: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-md border px-4 py-3 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--orange)]",
        selected
          ? "border-[var(--orange)] bg-[var(--orange-soft)] shadow-sm"
          : "border-[var(--navy)]/12 bg-white/80 hover:border-[var(--navy)]/30"
      )}
    >
      <div className="font-heading text-lg uppercase tracking-wide text-[var(--navy)]">
        {title}
      </div>
      {description && (
        <p className="mt-1 text-sm text-[var(--mid-slate)]">{description}</p>
      )}
    </button>
  );
}
