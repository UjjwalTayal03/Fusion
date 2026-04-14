import { useState } from "react"
import API from "../api"

export default function Login() {

  const [form, setForm] = useState({
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

      const res = await API.post("/auth/login", form)

      const token = res.data.accessToken

      // ✅ store token
      localStorage.setItem("token", token)

      alert("Login successful")

      // 👉 redirect to editor (temporary)
      window.location.href = "/editor"

    } catch (err) {
      alert(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

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

        <button type="submit">Login</button>

      </form>

      <br />

      <button onClick={() => window.location.href = "/register"}>
        Go to Register
      </button>

    </div>
  )
}