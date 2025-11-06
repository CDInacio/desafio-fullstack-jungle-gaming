import { Clock, Home, LogOut } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Link, useRouterState } from "@tanstack/react-router";

const items = [
  {
    title: "Início",
    url: "/home",
    icon: Home,
  },
  {
    title: "Histórico",
    url: "/audit-logs",
    icon: Clock,
  },
];

export function AppSidebar() {
  const { logout, user } = useAuth();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-accent border-r border-border">
        <SidebarGroup>
          {/* Header com Avatar */}
          <div className="px-4 py-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center">
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

          <SidebarGroupContent className="px-3 py-4">
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 outline-none",
                          // quando ativo: manter cor e permitir hover escurecendo um pouco o bg
                          isActive
                            ? "bg-sky-600/20 text-white hover:bg-sky-700/30"
                            : "text-zinc-400 hover:bg-sky-600/30 hover:text-white",
                          // foco visível para acessibilidade
                          "focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer com botão de logout */}
      <SidebarFooter className="bg-sidebar-accent p-4 border-t border-zinc-800">
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
