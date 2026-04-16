import { useEffect, useState } from "react"
import API from "../api"

export default function Join() {

  const [status, setStatus] = useState("Joining...")

  const token = window.location.pathname.split("/join/")[1]

  useEffect(() => {

    const join = async () => {
      try {
        await API.post(`/workspace/join/${token}`)
        setStatus("Joined successfully!")

        setTimeout(() => {
          window.location.href = "/workspace"
        }, 1500)

      } catch (err) {
        setStatus(err.response?.data?.message || "Join failed")
      }
    }

    join()

  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>{status}</h2>
    </div>
  )
}