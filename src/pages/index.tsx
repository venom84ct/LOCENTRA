import React from "react"
import PublicLayout from "@/components/layout/PublicLayout"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <PublicLayout>
      <section className="text-center py-16 px-6 bg-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Locentra</h1>
        <p className="text-lg text-gray-700 mb-8">
          Connecting homeowners with trusted, verified tradies.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register">
            <Button className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700">
              Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="px-6 py-3">
              Log In
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}

export default HomePage
