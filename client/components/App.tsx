import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserProfilePage from '../pages/UserProfilePage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<UserProfilePage />} />
      </Routes>
    </Router>
  )
}
