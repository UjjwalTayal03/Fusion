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

  // ⚠️ TEMP (replace later with real auth)
  const token = "YOUR_ACCESS_TOKEN"
  const documentId = "YOUR_DOCUMENT_ID"

  // 🔌 Init Socket
  useEffect(() => {
    socketRef.current = createSocket(token)

    socketRef.current.on("connect", () => {
      console.log("Connected:", socketRef.current.id)
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  // 📝 Init Quill
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

  // 📥 Load Document
  useEffect(() => {

    const socket = socketRef.current
    const quill = quillRef.current

    if (!socket || !quill) return

    socket.emit("joinDocument", { documentId })

    socket.on("loadDocument", (data) => {
      quill.setContents(data)
      quill.enable()
    })

    return () => {
      socket.off("loadDocument")
    }

  }, [])

  // 🔄 Receive Changes
  useEffect(() => {

    const socket = socketRef.current
    const quill = quillRef.current

    if (!socket || !quill) return

    socket.on("receiveDelta", (delta) => {
      quill.updateContents(delta)
    })

    return () => {
      socket.off("receiveDelta")
    }

  }, [])

  // 🚀 Send Changes
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

  // 👀 Document Presence
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

      {/* Top bar */}
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