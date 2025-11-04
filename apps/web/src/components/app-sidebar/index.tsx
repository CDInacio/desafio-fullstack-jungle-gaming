import { Clipboard, Home, LogOut, Bell, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { Link } from "@tanstack/react-router";

const items = [
  {
    title: "Início",
    url: "/home",
    icon: Home,
  },
  {
    title: "Tarefas",
    url: "/home",
    icon: Clipboard,
  },
];

export function AppSidebar() {
  const { logout, user } = useAuth();

  return (
    <Sidebar>
      <SidebarContent className="bg-zinc-900 border-r border-zinc-800">
        <SidebarGroup>
          {/* Header com Avatar */}
          <div className="px-4 py-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.username || "Usuário"}
                </p>
                <p className="text-zinc-500 text-xs truncate">
                  {user?.email || "email@exemplo.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <SidebarGroupContent className="px-3 py-4">
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group hover:bg-blue-600/10 hover:text-blue-600 text-zinc-400 rounded-lg transition-colors duration-150"
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer com botão de logout */}
      <SidebarFooter className="bg-zinc-900 p-4 border-t border-zinc-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors duration-150 group"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
