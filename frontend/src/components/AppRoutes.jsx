import { Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import LandingPage from "./LandingPage.jsx";
import GamePage from "./GamePage.jsx";
function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={ <LandingPage/> } />
      <Route path="/register" element={ <RegisterPage /> } />
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="/game/:id" element={ <GamePage />} />
    </Routes>
  )
}

export default AppRoutes