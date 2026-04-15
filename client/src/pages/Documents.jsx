import { useEffect, useState } from "react"
import API from "../api"

export default function Documents() {

  const params = new URLSearchParams(window.location.search)
  const workspaceId = params.get("workspaceId")

  const [docs, setDocs] = useState([])
  const [title, setTitle] = useState("")

  // 🔹 fetch docs
  const fetchDocs = async () => {
    try {
      const res = await API.get(`/workspace/${workspaceId}/documents`)
      setDocs(res.data.documents)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  // 🔹 create doc
  const handleCreate = async () => {
    try {
      await API.post(`/workspace/${workspaceId}/documents`, { title })
      setTitle("")
      fetchDocs()
    } catch (err) {
      alert("Error creating document")
    }
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>Documents</h2>

      {/* Create */}
      <div>
        <input
          placeholder="Document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <br />

      {/* List */}
      {docs.map((doc) => (
        <div key={doc._id} style={{ border: "1px solid", padding: 10, margin: 5 }}>
          <h3>{doc.title}</h3>

          <button
            onClick={() =>
              window.location.href = `/editor?id=${doc._id}`
            }
          >
            Open
          </button>
        </div>
      ))}

    </div>
  )
}