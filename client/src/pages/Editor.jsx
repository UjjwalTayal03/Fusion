import { useEffect, useRef, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { createSocket } from "../socket"

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, false] }],
  ["bold", "italic", "underline"],
  [{ list: "bullet" }],
  ["blockquote"],
  ["link"],
]

export default function Editor() {

  const wrapperRef = useRef(null)
  const quillRef = useRef(null)
  const socketRef = useRef(null)

  const [users, setUsers] = useState([])

  const token = localStorage.getItem("token")

  const params = new URLSearchParams(window.location.search)
  const documentId = params.get("id")

  // 🔌 SOCKET
  useEffect(() => {
    const socket = createSocket(token)
    socketRef.current = socket

    return () => socket.disconnect()
  }, [])

  // 💾 AUTOSAVE
  useEffect(() => {
    const interval = setInterval(async () => {
      const quill = quillRef.current
      if (!quill) return

      const content = quill.getContents()

      try {
        await fetch(`http://localhost:5000/api/documents/${documentId}/content`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ content })
        })
      } catch (err) {
        console.log("Autosave error:", err)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // 📝 INIT QUILL
  useEffect(() => {
    if (!wrapperRef.current) return

    wrapperRef.current.innerHTML = ""

    const editor = document.createElement("div")
    wrapperRef.current.append(editor)

    const quill = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })

    quill.disable()
    quill.setText("Loading...")

    quillRef.current = quill
  }, [])

  // 📥 LOAD DOC
  useEffect(() => {
    const socket = socketRef.current
    const quill = quillRef.current

    if (!socket || !quill) return

    const join = () => {
      socket.emit("joinDocument", { documentId })
    }

    if (socket.connected) join()
    else socket.once("connect", join)

    socket.once("loadDocument", (data) => {
      quill.setContents(data)
      quill.enable()
    })

  }, [])

  // 🔄 RECEIVE
  useEffect(() => {
    const socket = socketRef.current
    const quill = quillRef.current
    if (!socket || !quill) return

    socket.on("receiveDelta", (delta) => {
      quill.updateContents(delta, "silent")
    })

    return () => socket.off("receiveDelta")
  }, [])

  // 🚀 SEND
  useEffect(() => {
    const socket = socketRef.current
    const quill = quillRef.current
    if (!socket || !quill) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("sendDelta", { delta })
    }

    quill.on("text-change", handler)
    return () => quill.off("text-change", handler)

  }, [])

  // 👥 USERS
  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    socket.on("documentUsers", (usersList) => {
      setUsers(usersList)
    })

    return () => socket.off("documentUsers")
  }, [])

  return (
  <div className="h-screen flex flex-col bg-[#f5f1ea]">

    {/* Minimal Top Bar */}
    <div className="px-6 py-2 text-sm text-gray-500 border-b border-[#e7e1d8] bg-white">
      Fusion Docs
    </div>

    {/* Users */}
    <div className="px-6 py-2 border-b border-[#e7e1d8] bg-[#faf8f4] flex gap-2 flex-wrap">
      {users.map((u) => (
        <span
          key={u.id}
          className="px-2 py-1 text-xs rounded-full bg-[#e8dfd3] text-gray-700"
        >
          {u.name}
        </span>
      ))}
    </div>

    {/* Editor Area */}
    <div className="flex-1 overflow-y-auto flex justify-center py-10">

      <div className="w-full max-w-3xl bg-white shadow-sm rounded-xl border border-[#e7e1d8]">

        {/* Document Title */}
        <input
          placeholder="Untitled Document"
          className="w-full text-2xl font-semibold bg-transparent outline-none px-6 pt-6 text-gray-800"
        />

        {/* Quill Editor */}
        <div ref={wrapperRef} />

      </div>

    </div>

  </div>
)
}