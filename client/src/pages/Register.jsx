import { useState } from "react"
import API from "../api"

export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await API.post("/auth/register", form)

      alert("Registered successfully")
      window.location.href = "/login"

    } catch (err) {
      alert(err.response?.data?.message || "Register failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f1ea]">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#e7e1d8] p-8">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#e5ded3] bg-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-[#d6cbbd] text-sm"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#e5ded3] bg-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-[#d6cbbd] text-sm"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#e5ded3] bg-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-[#d6cbbd] text-sm"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#e8dfd3] hover:bg-[#ddd2c4] transition text-gray-800 font-medium"
          >
            Register
          </button>

        </form>

        <div className="mt-6 text-center">

          <button
            onClick={() => window.location.href = "/login"}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Already have an account? Login
          </button>

        </div>

      </div>

    </div>
  )
}