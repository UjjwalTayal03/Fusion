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
    <div style={{ padding: 20 }}>

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">Register</button>

      </form>

      <br />

      <button onClick={() => window.location.href = "/login"}>
        Go to Login
      </button>

    </div>
  )
}