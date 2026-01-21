import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Campaigns from './pages/Campaigns'
import Keywords from './pages/Keywords'
import Analytics from './pages/Analytics'
import ABTesting from './pages/ABTesting'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* App Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/keywords" element={<Keywords />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/ab-testing" element={<ABTesting />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App
