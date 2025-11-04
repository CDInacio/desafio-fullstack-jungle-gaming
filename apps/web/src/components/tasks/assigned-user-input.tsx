import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { IUser } from "@/types/auth";
import React from "react";

interface AssignedUserInputProps {
  users: IUser[];
  assignedUsers: IUser[];
  setAssignedUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
}

export function AssignedUserInput({
  users,
  assignedUsers,
  setAssignedUsers,
}: AssignedUserInputProps) {
  const [input, setInput] = React.useState("");
  const [showDropdown, setShowDropdown] = React.useState(false);

  const filteredUsers = users?.filter((u) =>
    u.username.toLowerCase().includes(input.toLowerCase())
  );

  const addUser = (user: IUser) => {
    setAssignedUsers((prev) =>
      prev.some((u) => u.id === user.id) ? prev : [...prev, user]
    );
    setInput("");
    setShowDropdown(false);
  };

  const removeUser = (id: string) => {
    setAssignedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="mt-3 sm:mt-5 relative">
      <Label htmlFor="assignTo" className="text-input mb-2 text-sm">
        Atribuir para
      </Label>

      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Digite o nome do usuário"
        className="text-input bg-primary border-none focus:ring-input/40 text-sm"
      />

      {showDropdown && input && filteredUsers?.length > 0 && (
        <Card className="absolute w-full mt-1 bg-primary border-none shadow-lg z-10 max-h-48 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => addUser(user)}
              className="p-2 sm:p-3 hover:bg-accent/70 cursor-pointer text-input text-sm"
            >
              {user.username}
            </div>
          ))}
        </Card>
      )}

      {assignedUsers.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {assignedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-1.5 sm:gap-2 bg-accent/50 text-input px-2 sm:px-3 py-1 rounded-full text-sm"
            >
              <span className="truncate max-w-[150px]">{user.username}</span>
              <button
                onClick={() => user.id && removeUser(user.id)}
                className="text-xs text-input/60 hover:text-input cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
