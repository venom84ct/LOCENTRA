import React from "react"
import PublicLayout from "@/components/layout/PublicLayout"

const HomePage = () => {
  return (
    <PublicLayout>
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Locentra</h1>
        <p className="text-lg mb-6">Find trusted tradies for any job, fast.</p>
      </div>
    </PublicLayout>
  )
}

export default HomePage
