import { useEffect, useRef, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import API from "../api"
import { createSocket } from "../socket"

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, false] }],
  ["bold", "italic", "underline"],
  [{ list: "bullet" }],
  ["link"],
]

export default function Editor() {
  const wrapperRef = useRef(null)
  const quillRef = useRef(null)
  const socketRef = useRef(null)

  const [versions, setVersions] = useState([])
  const [messages, setMessages] = useState([])
  const [chatMessage, setChatMessage] = useState("")

  const token = localStorage.getItem("token")

  const params = new URLSearchParams(window.location.search)
  const documentId = params.get("id")
  const workspaceId = params.get("workspaceId")

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    const socket = createSocket(token)
    socketRef.current = socket

    return () => socket.disconnect()
  }, [])

  /* ---------------- QUILL INIT ---------------- */
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

  /* ---------------- JOIN DOCUMENT ---------------- */
  useEffect(() => {
    const socket = socketRef.current
    const quill = quillRef.current

    if (!socket || !quill) return

    const join = () => {
      socket.emit("joinDocument", { documentId })
      socket.emit("joinWorkspace", { workspaceId })
    }

    if (socket.connected) join()
    else socket.once("connect", join)

    socket.once("loadDocument", (data) => {
      quill.setContents(data)
      quill.enable()
    })
  }, [])

  /* ---------------- RECEIVE DELTA ---------------- */
  useEffect(() => {
    const socket = socketRef.current
    const quill = quillRef.current

    if (!socket || !quill) return

    socket.on("receiveDelta", (delta) => {
      quill.updateContents(delta, "silent")
    })

    return () => socket.off("receiveDelta")
  }, [])

  /* ---------------- SEND DELTA ---------------- */
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

  /* ---------------- AUTOSAVE ---------------- */
  useEffect(() => {
    const interval = setInterval(async () => {
      const quill = quillRef.current
      if (!quill) return

      try {
        await API.put(`/documents/${documentId}/content`, {
          content: quill.getContents(),
        })
      } catch (err) {
        console.log(err)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  /* ---------------- VERSION HISTORY ---------------- */
  const fetchVersions = async () => {
    try {
      const res = await API.get(`/documents/${documentId}/versions`)
      setVersions(res.data.versions)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchVersions()
  }, [])

  const handleSaveVersion = async () => {
    const message = prompt("Enter version message")
    if (!message) return

    try {
      await API.post(`/documents/${documentId}/version`, { message })
      fetchVersions()
    } catch (err) {
      console.log(err)
    }
  }

  const handleRestore = async (versionId) => {
    try {
      const res = await API.post(`/documents/restore/${versionId}`)

      const quill = quillRef.current
      if (quill) {
        quill.setContents(res.data.document.content)
      }

      fetchVersions()
    } catch (err) {
      console.log(err)
    }
  }

  /* ---------------- CHAT ---------------- */
  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => socket.off("receiveMessage")
  }, [])

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    socketRef.current.emit("sendMessage", {
      workspaceId,
      message: chatMessage,
    })

    setChatMessage("")
  }

  return (
    <div className="h-screen flex overflow-hidden">

      {/* LEFT PANEL */}
      <div className="w-1/4 border-r flex flex-col">

        <div className="p-3 border-b flex justify-between">
          <h2>Versions</h2>

          <button onClick={handleSaveVersion}>
            Save
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {versions.map((v) => (
            <div key={v._id} className="border p-2 rounded">
              <p>{v.message}</p>
              <p className="text-xs">{v.editedBy?.name}</p>

              <button
                onClick={() => handleRestore(v._id)}
                className="text-xs mt-2"
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER PANEL */}
      <div className="w-2/4 flex flex-col">

        <div className="p-3 border-b">
          <h2>Fusion Docs</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div ref={wrapperRef} />
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/4 border-l flex flex-col">

        <div className="p-3 border-b">
          <h2>Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className="border p-2 rounded">
              <p className="text-xs">{msg.userId}</p>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>

        <div className="p-3 border-t flex gap-2">
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="flex-1 border px-2 py-1"
            placeholder="Type..."
          />

          <button onClick={handleSendMessage}>
            Send
          </button>
        </div>

      </div>

    </div>
  )
}