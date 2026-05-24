import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getRouter } from "./router";
import { AppProvider } from "./lib/app-context";
import { Toaster } from "./components/ui/sonner";
import "./styles.css";

const queryClient = new QueryClient();
const router = getRouter();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AppProvider>
    </QueryClientProvider>
  </StrictMode>
);
