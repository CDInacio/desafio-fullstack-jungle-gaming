import CenteredContainer from "@/components/centered-container";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useUsers } from "@/hooks/use-users.hook";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { IUser } from "@/types/auth";
import { useCreateTask } from "@/hooks/use-tasks.hook";
import type {
  AssignedUser,
  CreateTask,
  TaskStatus,
  TaskPriority,
  ITask,
} from "@/types/task";
import { useAuth } from "@/context/auth-context";

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
});

const status = [
  { label: "A fazer", value: "TODO" },
  { label: "Em progresso", value: "IN_PROGRESS" },
  { label: "Review", value: "REVIEW" },
  { label: "Feito", value: "DONE" },
];

const priorities = [
  { label: "Baixa", value: "LOW" },
  { label: "Média", value: "MEDIUM" },
  { label: "Alta", value: "HIGH" },
  { label: "Urgente", value: "URGENT" },
];

function RouteComponent() {
  const { user } = useAuth();
  const { data: users } = useUsers();
  const { mutate: createTask } = useCreateTask();

  const [assignInput, setAssignInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<IUser[]>([]);

  const filteredUsers =
    users &&
    users.filter((u) =>
      u.username.toLowerCase().includes(assignInput.toLowerCase())
    );

  const handleRemoveAssignedUser = (userId: string) => {
    setAssignedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleCreateTask = () => {
    const assignedUsersDto: AssignedUser[] = assignedUsers
      .filter((u) => u?.id)
      .map((u) => ({
        id: u.id!,
        username: u.username,
        email: u.email,
      }));

    const newTask: CreateTask = {
      title,
      description: description,
      status: selectedStatus as TaskStatus,
      priority: selectedPriority as TaskPriority,
      createdBy: user?.id ?? "",
      assignedUsers: assignedUsersDto.length > 0 ? assignedUsersDto : undefined,
    };

    createTask(newTask as ITask);
  };

  return (
    <Layout>
      <CenteredContainer className="text-input">
        <div className="flex flex-col">
          <p className="text-center mt-10 text-input/60">
            Você ainda não possui nenhuma tarefa criada.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-foreground cursor-pointer hover:bg-accent/70 mt-4 mx-auto"
              >
                Criar
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-[#2a2a2a]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-input text-2xl">
                  Nova tarefa
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Preencha os campos abaixo para criar uma nova tarefa.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div>
                <Label htmlFor="title" className="text-input mb-2">
                  Título
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-input bg-primary border-none focus:ring-input/40"
                  name="title"
                />

                <Label htmlFor="description" className="text-input mt-5 mb-2">
                  Descrição
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                  className="text-input bg-primary border-none focus:ring-input/40"
                />

                <div className="flex gap-3 mt-5">
                  <div className="flex-1">
                    <Select onValueChange={(value) => setSelectedStatus(value)}>
                      <SelectTrigger className="bg-primary border-none text-primary-foreground cursor-pointer w-full">
                        <SelectValue placeholder="Selecionar status" />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-primary text-primary-foreground border-none shadow-lg rounded-lg"
                        position="popper"
                        sideOffset={5}
                      >
                        <SelectGroup>
                          <SelectLabel className="text-input/80 px-2">
                            Status
                          </SelectLabel>
                          {status.map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Select
                      onValueChange={(value) => setSelectedPriority(value)}
                    >
                      <SelectTrigger className="bg-primary border-none text-primary-foreground cursor-pointer w-full">
                        <SelectValue placeholder="Selecionar prioridade" />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-primary text-primary-foreground border-none shadow-lg rounded-lg"
                        position="popper"
                        sideOffset={5}
                      >
                        <SelectGroup>
                          <SelectLabel className="text-input/80 px-2">
                            Prioridade
                          </SelectLabel>
                          {priorities.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-5 relative">
                  <Label htmlFor="assignTo" className="text-input mb-2">
                    Atribuir para
                  </Label>

                  <Input
                    value={assignInput}
                    onChange={(e) => {
                      setAssignInput(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const userToAdd = users?.find(
                          (u) =>
                            u.username.toLowerCase() ===
                            assignInput.toLowerCase()
                        );

                        if (userToAdd) {
                          // Evita duplicatas
                          setAssignedUsers((prev) =>
                            prev.some((u) => u.id === userToAdd.id)
                              ? prev
                              : [...prev, userToAdd]
                          );
                          setAssignInput("");
                          setShowDropdown(false);
                        }
                      }
                    }}
                    placeholder="Digite o nome do usuário a ser atribuído"
                    className="text-input bg-primary border-none focus:ring-input/40"
                    name="assignTo"
                    autoComplete="off"
                  />

                  {/* Dropdown */}
                  {showDropdown &&
                    assignInput &&
                    filteredUsers &&
                    filteredUsers.length > 0 && (
                      <Card className="absolute w-full mt-1 bg-primary border-none shadow-lg z-10">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => {
                              setAssignedUsers((prev) =>
                                prev.some((user) => user.id === user.id)
                                  ? prev
                                  : [...prev, user]
                              );
                              setAssignInput("");
                              setShowDropdown(false);
                            }}
                            className="p-2 hover:bg-accent/70 cursor-pointer text-input"
                          >
                            {user.username}
                          </div>
                        ))}
                      </Card>
                    )}

                  {/* Nenhum usuário encontrado */}
                  {showDropdown &&
                    assignInput &&
                    filteredUsers &&
                    filteredUsers.length === 0 && (
                      <Card className="absolute w-full mt-1 bg-primary border-none shadow-lg z-10">
                        <div className="p-2 text-input/70">
                          Nenhum usuário encontrado
                        </div>
                      </Card>
                    )}

                  {/* Lista de usuários atribuídos */}
                  {assignedUsers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {assignedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 bg-accent/50 text-input px-3 py-1 rounded-full"
                        >
                          <span>{user.username}</span>
                          <button
                            onClick={() =>
                              user.id && handleRemoveAssignedUser(user.id)
                            }
                            className="text-xs text-input/60 hover:text-input cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={handleCreateTask}
                >
                  Criar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CenteredContainer>
    </Layout>
  );
}
