import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import "./App.scss";
import "@mantine/core/styles.css";
import MainLayout from "./components/Layout/MainLayout";
import { CreatePost } from "./pages/CreatePost";
import { HomePage } from "./pages/HomePage";
import { NotFound } from "./pages/NotFound";
import { Post } from "./pages/Post";
import { AuthCallback } from "./pages/AuthCallback";
import { Login } from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import SavedPage from "./pages/SavedPage";

export const theme = createTheme({
  primaryColor: "primary",
  colors: {
    // Custom graphite-style dark shades
    dark: [
      "#cfd4d9", // 0 - lightest (text)
      "#a9b0b8",
      "#878e96",
      "#686f76",
      "#4d5359",
      "#3a3f44",
      "#2b2f33",
      "#1f2225",
      "#151719",
      "#101113", // 9 - darkest (background)
    ],

    // Primary: Violet
    primary: [
      "#f5f3ff",
      "#ede9fe",
      "#ddd6fe",
      "#c4b5fd",
      "#a78bfa",
      "#8b5cf6",
      "#7c3aed",
      "#6d28d9",
      "#5b21b6",
      "#4c1d95",
    ],

    // Secondary: Amber
    amber: [
      "#fffbeb",
      "#fef3c7",
      "#fde68a",
      "#fcd34d",
      "#fbbf24",
      "#f59e0b",
      "#d97706",
      "#b45309",
      "#92400e",
      "#78350f",
    ],

    red: [
      "#ffe4e6",
      "#fecdd3",
      "#fda4af",
      "#fb7185",
      "#f43f5e",
      "#e11d48",
      "#be123c",
      "#9f1239",
      "#881337",
      "#4c1d24",
    ],
    green: [
      "#d1fae5",
      "#a7f3d0",
      "#6ee7b7",
      "#34d399",
      "#10b981",
      "#059669",
      "#047857",
      "#065f46",
      "#064e3b",
      "#022c22",
    ],
  },

  // Optional UI tweaks
  fontFamily: "Inter, sans-serif",
  fontFamilyMonospace: "Fira Code, monospace",
  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  defaultRadius: "md",
});

// Auth guard component to check for session
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth-callback",
    element: <AuthCallback />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { path: "", element: <HomePage /> },
      { path: "post/:postId", element: <Post /> },
      { path: "create-post", element: <CreatePost /> },
      { path: "post/:postId/edit", element: <CreatePost /> },
      { path: "profile/:username", element: <ProfilePage /> },
      { path: "saved", element: <SavedPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
