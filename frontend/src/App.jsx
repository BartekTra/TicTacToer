
import AppRoutes from './components/AppRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserProvider } from './context/UserContext';

function App() {

  return (
    <Router>
      <div className="app">
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </div>
    </Router>
  )
}

export default App
