export interface StatusInfo {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type TaskStatusKey = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
