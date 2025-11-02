import { Clipboard, Home, LogOut, Mail, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "../ui/avatar";

const items = [
  {
    title: "Início",
    url: "#",
    icon: Home,
  },
  {
    title: "Tarefas",
    url: "#",
    icon: Clipboard,
  },
  {
    title: "Notificações",
    url: "#",
    icon: Mail,
  },
  {
    title: "Perfil",
    url: "#",
    icon: User,
  },
];

export function AppSidebar() {
  const { logout, user } = useAuth();
  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-primary">
        <SidebarGroup>
          <SidebarGroupLabel className="text-input">
            Application
          </SidebarGroupLabel>
          <div className="w-10 my-5 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-medium flex-shrink-0">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="text-input" key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-primary hover:text-input"
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-sidebar-primary flex justify-center">
        <div className="flex gap-x-2 ">
          <LogOut
            size="20px"
            className="text-input cursor-pointer"
            onClick={logout}
          />{" "}
          <p className="text-input">Sair</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
