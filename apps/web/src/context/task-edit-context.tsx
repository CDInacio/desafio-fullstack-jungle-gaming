import { createContext, useContext, useState, type ReactNode } from "react";
import type { ITask } from "@/types/task";

interface TaskEditContextType {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
  currentTask: ITask | null;
  setCurrentTask: (task: ITask | null) => void;
  editedFields: Partial<ITask>;
  setEditedFields: (fields: Partial<ITask>) => void;
  updateField: <K extends keyof ITask>(field: K, value: ITask[K]) => void;
  resetEditState: () => void;
  hasChanges: boolean;
}

const TaskEditContext = createContext<TaskEditContextType | undefined>(
  undefined
);

interface TaskEditProviderProps {
  children: ReactNode;
  initialTask?: ITask | null;
}

export function TaskEditProvider({
  children,
  initialTask = null,
}: TaskEditProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState<ITask | null>(initialTask);
  const [editedFields, setEditedFields] = useState<Partial<ITask>>({});

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    if (isEditMode) {
      setEditedFields({});
    }
  };

  const updateField = <K extends keyof ITask>(field: K, value: ITask[K]) => {
    setEditedFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetEditState = () => {
    setIsEditMode(false);
    setEditedFields({});
  };

  // Verifica se há mudanças comparando com a task atual
  const hasChanges =
    Object.keys(editedFields).length > 0 &&
    Object.entries(editedFields).some(([key, value]) => {
      if (!currentTask) return false;
      return currentTask[key as keyof ITask] !== value;
    });

  const value: TaskEditContextType = {
    isEditMode,
    setIsEditMode,
    toggleEditMode,
    currentTask,
    setCurrentTask,
    editedFields,
    setEditedFields,
    updateField,
    resetEditState,
    hasChanges,
  };

  return (
    <TaskEditContext.Provider value={value}>
      {children}
    </TaskEditContext.Provider>
  );
}

export function useTaskEdit() {
  const context = useContext(TaskEditContext);
  if (context === undefined) {
    throw new Error("useTaskEdit must be used within a TaskEditProvider");
  }
  return context;
}
