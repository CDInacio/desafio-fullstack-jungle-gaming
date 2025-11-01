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

const queryClient = new QueryClient();

function NotificationsConnector() {
  const { token } = useAuth();
  const qc = useQueryClient();

  useNotifications(token, {
    onTaskCreated: (payload) => {
      // exemplo: invalidar lista de tarefas e mostrar toast
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Nova tarefa atribuída a você");
    },
    onTaskUpdated: (payload) => {
      // se estiver na página de detalhe e for a mesma tarefa, re-fetch
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

  return null; // componente invisível, só para conectar handlers
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
    context: { auth },
  });

  return (
    <>
      <NotificationsConnector />
      <RouterProvider router={router} context={{ auth }} />
    </>
  );
}

export default App;
