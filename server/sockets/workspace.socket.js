import { addUser, removeUser } from "./presence.store.js"

export default function workspaceSocket(io, socket) {

  socket.on("joinWorkspace", ({ workspaceId }) => {

    const room = `workspace:${workspaceId}`

    socket.join(room)

    socket.workspaceId = workspaceId

    const users = addUser(workspaceId, socket.user._id.toString())

    io.to(room).emit("workspaceUsers", users)
  })


  socket.on("sendMessage", ({ workspaceId, message }) => {

    const room = `workspace:${workspaceId}`

    io.to(room).emit("receiveMessage", {
      userId: socket.user._id,
      message,
      createdAt: new Date()
    })

  })


  socket.on("disconnect", () => {

    if (!socket.workspaceId) return

    const room = `workspace:${socket.workspaceId}`

    const users = removeUser(
      socket.workspaceId,
      socket.user._id.toString()
    )

    io.to(room).emit("workspaceUsers", users)

  })

}