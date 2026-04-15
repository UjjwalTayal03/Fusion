import { useEffect, useState } from "react"
import API from "../api"

export default function Workspace() {

  const [workspaces, setWorkspaces] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  // 🔹 fetch workspaces
  const fetchWorkspaces = async () => {
    try {
      const res = await API.get("/workspace")
      setWorkspaces(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  // 🔹 create workspace
  const handleCreate = async () => {
    try {
      await API.post("/workspace", { name, description })
      setName("")
      setDescription("")
      fetchWorkspaces()
    } catch (err) {
      alert("Error creating workspace")
    }
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>Workspaces</h2>

      {/* Create */}
      <div>
        <input
          placeholder="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <br />

      {/* List */}
      {workspaces.map((ws) => (
        <div key={ws._id} style={{ border: "1px solid", padding: 10, margin: 5 }}>
          <h3>{ws.name}</h3>
          <p>{ws.description}</p>

          <button
            onClick={() =>
              window.location.href = `/documents?workspaceId=${ws._id}`
            }
          >
            Open
          </button>
        </div>
      ))}

    </div>
  )
}