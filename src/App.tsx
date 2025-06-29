import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import "@mantine/core/styles.css";
import MainLayout from "./components/layout/MainLayout";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Post } from "./pages/Post";
import { createTheme, MantineProvider } from "@mantine/core";

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
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;
