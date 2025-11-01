import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}
