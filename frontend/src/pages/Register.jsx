// src/pages/Register.jsx
import React, { useState } from 'react'
import { register } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name, setName] = useState('')
  const [username, setUsername] = useState('') // new
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      // ensure username included
      await register({ name, username, email, password })
      alert('Registered')
      nav('/login')
    } catch (err) {
      console.error(err)
      // show server message if present
      const msg = err?.response?.data?.message || 'Register failed'
      alert(msg)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-3">Register</h2>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Full name"
        className="w-full border p-2 mb-2"
        required
      />

      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username (unique)"
        className="w-full border p-2 mb-2"
        required
      />

      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="w-full border p-2 mb-2"
        required
      />

      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="w-full border p-2 mb-2"
        required
      />

      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Register</button>
    </form>
  )
}
