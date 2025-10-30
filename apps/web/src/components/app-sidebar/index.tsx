import {
  Calendar,
  Clipboard,
  Home,
  Inbox,
  LogOut,
  Mail,
  Search,
  Settings,
  User,
} from "lucide-react";

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
  return (
    <Sidebar>
      <SidebarContent className="bg-foreground">
        <SidebarGroup>
          <SidebarGroupLabel className="text-input">
            Application
          </SidebarGroupLabel>
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
      <SidebarFooter className="bg-foreground flex justify-center">
        <div className="flex gap-x-2">
          <LogOut size="20px" className="text-input" />{" "}
          <p className="text-input">Sair</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
