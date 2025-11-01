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
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppWithRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppWithRouter() {
  const auth = useAuth();

  const router = createRouter({
    routeTree,
    context: { auth },
  });

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
