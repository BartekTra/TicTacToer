import { useState } from 'react'
import AppRoutes from './components/AppRoutes'
import { Link, BrowserRouter as Router } from 'react-router-dom'


function App() {

  return (
    <Router>
      <div className="app">
        <AppRoutes />
      </div>
    </Router>
  )
}

export default App
