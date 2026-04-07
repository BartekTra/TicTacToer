import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage/LoginPage";
import NotFoundPage from "./pages/ErrorPage/NotFound";
import LandingPage from "./pages/LandingPage/LandingPage";
import RegisterPage from "./pages/Auth/RegisterPage/RegisterPage";
import GamePage from "./pages/GamePage/GamePage";
import MainLayout from "./pages/MainLayout/MainLayout";

export const router = createBrowserRouter([
  {
    element: (
      <MainLayout />
    ),
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/game/:id",
        element: <GamePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
