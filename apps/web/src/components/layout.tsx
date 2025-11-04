import type React from "react";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative">
        <SidebarTrigger className="bg-white mt-3 ml-3 sm:mt-5 sm:ml-5 cursor-pointer absolute top-0 left-0 z-10" />
        {children}
      </main>
      <footer></footer>
    </SidebarProvider>
  );
}
