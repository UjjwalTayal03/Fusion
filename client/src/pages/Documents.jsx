import { useEffect, useState } from "react"
import API from "../api"

export default function Documents() {

  const params = new URLSearchParams(window.location.search)
  const workspaceId = params.get("workspaceId")

  const [docs, setDocs] = useState([])
  const [title, setTitle] = useState("")

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
    <div className="min-h-screen bg-[#f5f1ea] p-6">

      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Documents
      </h2>

      {/* Create Document */}
      <div className="bg-white border border-[#e7e1d8] rounded-xl p-4 mb-8 max-w-xl flex gap-3 shadow-sm">

        <input
          placeholder="New document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-[#e5ded3] bg-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-[#d6cbbd] text-sm"
        />

        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-lg bg-[#e8dfd3] hover:bg-[#ddd2c4] transition text-gray-800 text-sm font-medium"
        >
          Create
        </button>

      </div>

      {/* Documents Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {docs.map((doc) => (
          <div
            key={doc._id}
            className="bg-white border border-[#e7e1d8] rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() =>
              window.location.href = `/editor?id=${doc._id}`
            }
          >
            <h3 className="text-lg font-medium text-gray-800">
              {doc.title}
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              Click to open document
            </p>
          </div>
        ))}

      </div>

    </div>
  )
}