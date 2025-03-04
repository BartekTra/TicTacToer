import React from "react";
import { Route, Routes } from "react-router-dom";
import ObjectsList from "./ObjectsList.jsx";
import Games from "./Games.jsx";
import LoginPage from "./LoginPage.jsx";
function AppRoutes() {

  return (
    <Routes>
      <Route path="ObjectsList/" element={ <ObjectsList /> } />
      <Route path="/" element={ <LoginPage/> } />
      <Route path="games/:id" element={ <Games /> } />
    </Routes>
  )
}

export default AppRoutes