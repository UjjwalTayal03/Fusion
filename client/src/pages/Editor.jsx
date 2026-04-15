import { useEffect, useRef, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { createSocket } from "../socket"

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline"],
  ["image", "code-block"],
]

export default function Editor() {

  const wrapperRef = useRef(null)
  const quillRef = useRef(null)
  const socketRef = useRef(null)

  const [users, setUsers] = useState([])

  // 🔥 IMPORTANT: REMOVE "Bearer "
  const token = localStorage.getItem("token")

  const params = new URLSearchParams(window.location.search)
const documentId = params.get("id")

  // 🔌 INIT SOCKET
  useEffect(() => {

    const socket = createSocket(token)
    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Connected:", socket.id)
    })

    socket.on("connect_error", (err) => {
      console.log("Socket error:", err.message)
    })

    return () => {
      socket.disconnect()
    }

  }, [])

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

  }, 2000) // every 2 sec

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

  // 📥 LOAD DOCUMENT + JOIN ROOM
  useEffect(() => {

  const socket = socketRef.current
  const quill = quillRef.current

  if (!socket || !quill) return

  const join = () => {
    socket.emit("joinDocument", { documentId })
  }

  if (socket.connected) {
    join()
  } else {
    socket.once("connect", join)
  }

  // 🟢 ONLY enable editing AFTER document loads
  socket.once("loadDocument", (data) => {
    quill.setContents(data)
    quill.enable()
  })

}, [])

  // 🔄 RECEIVE DELTAS
  useEffect(() => {

    const socket = socketRef.current
    const quill = quillRef.current

    if (!socket || !quill) return

    socket.on("receiveDelta", (delta) => {
      quill.updateContents(delta, "silent")
    })

    return () => {
      socket.off("receiveDelta")
    }

  }, [])

  // 🚀 SEND DELTAS
  useEffect(() => {

    const socket = socketRef.current
    const quill = quillRef.current

    if (!socket || !quill) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return

      socket.emit("sendDelta", { delta })
    }

    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }

  }, [])

  //  doc pres.
  useEffect(() => {

    const socket = socketRef.current
    if (!socket) return

    socket.on("documentUsers", (usersList) => {
      setUsers(usersList)
    })

    return () => {
      socket.off("documentUsers")
    }

  }, [])

  return (
    <div className="h-screen flex flex-col">

      {/* Header */}
      <div className="p-4 border-b">
        <h1>Fusion Editor</h1>
      </div>

      {/* Users */}
      <div className="p-2 border-b">
        <strong>Active Users:</strong>
        <div>
          {users.map((u) => (
            <span key={u.id} style={{ marginRight: 10 }}>
              {u.name}
            </span>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <div ref={wrapperRef} style={{ height: "100%" }} />
      </div>

    </div>
  )
}