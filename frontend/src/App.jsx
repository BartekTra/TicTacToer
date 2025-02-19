import { useState } from 'react'
import './App.css'
import AppRoutes from './components/AppRoutes'
import { Link, BrowserRouter as Router } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="app">
        <AppRoutes />
      </div>
    </Router>
  )
}

export default App
