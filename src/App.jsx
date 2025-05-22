import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import AdminLogin from './pages/AdminLogin.jsx'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
