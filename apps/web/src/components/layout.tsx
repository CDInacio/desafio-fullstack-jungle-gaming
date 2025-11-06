import type React from "react";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { History, Link } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Link
        to="/audit-logs"
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
      >
        <History className="w-4 h-4" />
        <span>Auditoria</span>
      </Link>
      <main className="w-full relative">
        <SidebarTrigger className="bg-white mt-3 ml-3 sm:mt-5 sm:ml-5 cursor-pointer absolute top-0 left-0 z-10" />
        {children}
      </main>
      <footer></footer>
    </SidebarProvider>
  );
}
