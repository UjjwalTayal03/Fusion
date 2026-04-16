import { useEffect, useState } from "react"
import API from "../api"

export default function Workspace() {
  const [workspaces, setWorkspaces] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [inviteLinks, setInviteLinks] = useState({})

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

  const handleInvite = async (workspaceId) => {
    try {
      const res = await API.post(`/workspace/${workspaceId}/invite`)

      setInviteLinks((prev) => ({
        ...prev,
        [workspaceId]: res.data.inviteLink,
      }))

      navigator.clipboard.writeText(res.data.inviteLink)
      alert("Invite link copied!")
    } catch (err) {
      alert("Error generating invite")
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea] p-6">

      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Workspaces
      </h2>

      {/* Create Workspace */}
      <div className="bg-white border border-[#e7e1d8] rounded-xl p-4 mb-8 max-w-xl space-y-3 shadow-sm">

        <input
          placeholder="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-[#e5ded3] bg-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-[#d6cbbd] text-sm"
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-[#e5ded3] bg-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-[#d6cbbd] text-sm"
        />

        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-lg bg-[#e8dfd3] hover:bg-[#ddd2c4] transition text-gray-800 text-sm font-medium"
        >
          Create Workspace
        </button>

      </div>

      {/* Workspace List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {workspaces.map((ws) => (
          <div
            key={ws._id}
            className="bg-white border border-[#e7e1d8] rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {ws.name}
            </h3>

            <p className="text-sm text-gray-600 mt-1 mb-4">
              {ws.description}
            </p>

            <div className="flex gap-2 flex-wrap">

              <button
                onClick={() =>
                  window.location.href = `/documents?workspaceId=${ws._id}`
                }
                className="px-3 py-1.5 text-sm rounded-md bg-[#f1ebe3] hover:bg-[#e6dccf]"
              >
                Open
              </button>

              <button
                onClick={() => handleInvite(ws._id)}
                className="px-3 py-1.5 text-sm rounded-md border border-[#ddd3c6] hover:bg-[#f8f5f0]"
              >
                Invite
              </button>

            </div>

            {/* Invite Link */}
            {inviteLinks[ws._id] && (
              <div className="mt-4 flex gap-2">

                <input
                  value={inviteLinks[ws._id]}
                  readOnly
                  className="flex-1 px-2 py-1 text-xs rounded-md border border-[#e5ded3] bg-[#faf8f4]"
                />

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(inviteLinks[ws._id])
                  }
                  className="px-2 py-1 text-xs rounded-md bg-[#e8dfd3] hover:bg-[#ddd2c4]"
                >
                  Copy
                </button>

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  )
}