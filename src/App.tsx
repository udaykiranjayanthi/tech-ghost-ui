import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import "@mantine/core/styles.css";
import MainLayout from "./components/Layout/MainLayout";
import { CreatePost } from "./pages/CreatePost";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Post } from "./pages/Post";
import { AuthCallback } from "./pages/AuthCallback";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "post/:postId", element: <Post /> },
      { path: "create-post", element: <CreatePost /> },
      { path: "post/:postId/edit", element: <CreatePost /> },
      { path: "auth-callback", element: <AuthCallback /> },
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
