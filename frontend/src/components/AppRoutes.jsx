import React from "react";
import { Route, Routes } from "react-router-dom";
import Buttons from "./Buttons.jsx";
import ObjectsList from "./ObjectsList.jsx";
import Games from "./Games.jsx";

function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<ObjectsList />} />
      <Route path="buttons/:id" element={<Buttons />} />
      <Route path="games/:id" element={<Games />} />
    </Routes>
  )
}

export default AppRoutes