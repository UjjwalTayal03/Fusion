export default function documentSocket(io, socket) {
  socket.on("joinDocument", ({ documentId }) => {
    const room = `document:${documentId}`;

    socket.join(room);

    socket.documentId = documentId;

    console.log(`Socket ${socket.id} joined ${room}`);
  });

  socket.on("sendDelta", ({ documentId, delta }) => {
    const room = `document:${documentId}`;

    socket.to(room).emit("receiveDelta", delta);
  });

  socket.on("cursorMove", ({ documentId, userId, range }) => {
    const room = `document:${documentId}`;

    socket.to(room).emit("cursorUpdate", {
      userId,
      range,
    });
  });
}
