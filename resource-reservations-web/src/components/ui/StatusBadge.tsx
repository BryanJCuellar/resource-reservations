interface StatusBadgeProps {
  active: boolean;
  label: string;
  showDot?: boolean;
}

export function StatusBadge({
  active,
  label,
  showDot = true,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
          : "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
      }`}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={`mr-1.5 size-1.5 rounded-full ${active ? "bg-emerald-600 dark:bg-emerald-400" : "bg-slate-400"}`}
        />
      )}
      {label}
    </span>
  );
}
