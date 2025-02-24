import React from "react";
import { Route, Routes } from "react-router-dom";
import ObjectsList from "./ObjectsList.jsx";
import Games from "./Games.jsx";

function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<ObjectsList />} />
      <Route path="games/:id" element={<Games />} />
    </Routes>
  )
}

export default AppRoutes