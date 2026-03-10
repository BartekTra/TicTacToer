import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage/LoginPage';
import NotFoundPage from './pages/ErrorPage/NotFound';
import LandingPage from './pages/LandingPage/LandingPage';
import RegisterPage from './pages/Auth/RegisterPage/RegisterPage';
import GamePage from './pages/GamePage/GamePage';
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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
    path: "/game/:id",
    element: <GamePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />, 
  }
]);