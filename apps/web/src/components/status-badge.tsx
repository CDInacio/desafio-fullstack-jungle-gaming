import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<string, string> = {
  TODO: "bg-amber-300 text-amber-900 dark:bg-amber-300/40 dark:text-amber-200",
  IN_PROGRESS: "bg-sky-300 text-sky-900 dark:bg-sky-300/40 dark:text-sky-200",
  REVIEW:
    "bg-violet-300 text-violet-900 dark:bg-violet-300/40 dark:text-violet-200",
  DONE: "bg-emerald-300 text-emerald-900 dark:bg-emerald-300/40 dark:text-emerald-200",
};

const STATUS_TEXT: Record<string, string> = {
  TODO: "A fazer",
  IN_PROGRESS: "Em progresso",
  REVIEW: "Em revisão",
  DONE: "Concluído",
};

export function StatusBadge({ status }: { status: string }) {
  const classes =
    STATUS_STYLES[status] ??
    "bg-gray-300 text-gray-900 dark:bg-gray-300/40 dark:text-gray-200";
  const text = STATUS_TEXT[status] ?? status;

  return (
    <Badge className={`${classes} border-none text-xs sm:text-sm whitespace-nowrap`} variant="outline">
      {text}
    </Badge>
  );
}
