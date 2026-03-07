import Document from "../models/Document.js";

export default function documentSocket(io, socket) {

  socket.on("joinDocument", async ({ documentId }) => {

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

  socket.emit("loadDocument", document.content)

})


  socket.on("sendDelta", ({ delta }) => {

    const room = `document:${socket.documentId}`;

    socket.to(room).emit("receiveDelta", delta);

  });


  socket.on("cursorMove", ({ userId, range }) => {

    const room = `document:${socket.documentId}`;

    socket.to(room).emit("cursorUpdate", {
      userId,
      range
    });

  });

}