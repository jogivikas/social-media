import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Connections from './pages/Connections'

export default function App(){
  return (
    <div>
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto p-3 flex justify-between items-center">
          <Link to="/" className="font-bold">Social App</Link>
          <div className="space-x-3">
            <Link to="/connections" className="text-sm">Connections</Link>
            <Link to="/profile" className="text-sm">Profile</Link>
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/register" className="text-sm">Register</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/connections" element={<Connections/>} />
        </Routes>
      </main>
    </div>
  )
}
