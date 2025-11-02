import {
  RouterProvider,
  createRouter,
  type Router,
} from "@tanstack/react-router";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof Router;
  }
}

import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuth } from "@/context/auth-context";
import {
  QueryClientProvider,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { useNotifications } from "./hooks/use-notification";
import { toast } from "sonner";
import type { AuthState } from "./types/auth";

interface MyRouterContext {
  auth: AuthState; // ou o tipo correto do seu useAuth
  queryClient: QueryClient;
}

const queryClient = new QueryClient();

function NotificationsConnector() {
  const { user } = useAuth();
  const qc = useQueryClient();

  useNotifications(user?.id || null, {
    onTaskCreated: (payload) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Nova tarefa atribuída a você");
    },
    onTaskUpdated: (payload) => {
      if (payload?.task?.id)
        qc.invalidateQueries({ queryKey: ["task", payload.task.id] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.info("Tarefa atualizada");
    },
    onCommentNew: (payload) => {
      if (payload?.task?.id) {
        qc.invalidateQueries({
          queryKey: ["task", payload.task.id, "comments"],
        });
      }
      toast.info("Novo comentário em uma tarefa que você participa");
    },
  });

  return null;
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppWithRouter />
      </QueryClientProvider>
    </AuthProvider>
  );
}

function AppWithRouter() {
  const auth = useAuth();
  const router = createRouter({
    routeTree,
    context: {
      auth,
    },
  });

  return (
    <>
      <NotificationsConnector />
      <RouterProvider router={router} context={{ auth }} />
    </>
  );
}

export default App;
