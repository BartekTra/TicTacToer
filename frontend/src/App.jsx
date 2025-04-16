import { useState } from 'react'
import AppRoutes from './components/AppRoutes'
import { Link, BrowserRouter as Router } from 'react-router-dom'
import useAuth from './store/useAuth.js';


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="app">
        <AppRoutes />
      </div>
    </Router>
  )
}

export default App
