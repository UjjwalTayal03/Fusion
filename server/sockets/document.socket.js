import Document from "../models/Document.js"
import { addDocUser, removeDocUser } from "./documentPresence.store.js"

export default function documentSocket(io, socket) {

  socket.on("joinDocument", async ({ documentId }) => {

    try {

      const document = await Document.findById(documentId).populate("workspace")

      if (!document) {
        socket.emit("error", "Document not found")
        return
      }

      const isMember = document.workspace.members.some(
        m => m.user.toString() === socket.user._id.toString()
      )

      if (!isMember) {
        socket.emit("error", "Access denied")
        return
      }

      const room = `document:${documentId}`

      socket.join(room)

      socket.documentId = documentId

      // presence
      const users = addDocUser(documentId, socket.user)
      io.to(room).emit("documentUsers", users)

      // load content
      socket.emit("loadDocument", document.content)

      console.log(`User ${socket.user._id} joined ${room}`)

    } catch (err) {
      console.error("joinDocument error:", err)
    }

  })


  socket.on("sendDelta", ({ delta }) => {

    if (!socket.documentId) return

    const room = `document:${socket.documentId}`

    socket.to(room).emit("receiveDelta", delta)

  })


  socket.on("cursorMove", ({ range }) => {

    if (!socket.documentId) return

    const room = `document:${socket.documentId}`

    socket.to(room).emit("cursorUpdate", {
      userId: socket.user._id,
      range
    })

  })


  socket.on("disconnect", () => {

    if (!socket.documentId) return

    const room = `document:${socket.documentId}`

    const users = removeDocUser(
      socket.documentId,
      socket.user._id
    )

    io.to(room).emit("documentUsers", users)

  })

}