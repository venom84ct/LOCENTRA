import React from "react"
import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Locentra</h1>
      <p className="mb-6">Connecting homeowners with trusted tradies.</p>
      <div className="space-x-4">
        <Link to="/login" className="text-blue-600 underline">
          Login
        </Link>
        <Link to="/register" className="text-blue-600 underline">
          Register
        </Link>
      </div>
    </div>
  )
}

export default HomePage
