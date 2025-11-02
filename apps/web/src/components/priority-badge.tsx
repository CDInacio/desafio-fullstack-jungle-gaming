import { Badge } from "./ui/badge";

export function PriorityBadge({ priority }: { priority: string }) {
  const PRIORITY_STYLES: Record<string, string> = {
    LOW: "bg-emerald-300 text-emerald-900 dark:bg-green-300/40 dark:text-green-200",
    MEDIUM:
      "bg-amber-300 text-yellow-900 dark:bg-yellow-300/40 dark:text-yellow-200",
    HIGH: "bg-red-300 text-red-900 dark:bg-red-300/40 dark:text-red-200",
  };
  const PRIORITY_TEXT: Record<string, string> = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
  };

  return (
    <Badge
      className={`${PRIORITY_STYLES[priority] ?? "bg-gray-300 text-gray-900 dark:bg-gray-300/40 dark:text-gray-200"} border-none `}
      variant="outline"
    >
      {PRIORITY_TEXT[priority] ?? priority}
    </Badge>
  );
}
