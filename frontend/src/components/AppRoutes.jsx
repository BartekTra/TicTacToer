import React from "react";
import { Route, Routes } from "react-router-dom";
import ObjectsList from "./ObjectsList.jsx";
import Games from "./Games.jsx";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import LandingPage from "./LandingPage.jsx";
function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={ <LandingPage/> } />
      <Route path="/register" element={ <RegisterPage /> } />
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="ObjectsList/" element={ <ObjectsList /> } />
      <Route path="games/:id" element={ <Games /> } />
    </Routes>
  )
}

export default AppRoutes