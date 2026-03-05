import { addUser, removeUser } from "./presence.store.js"

export default function workspaceSocket(io, socket) {

  socket.on("joinWorkspace", ({ workspaceId, userId }) => {

    const room = `workspace:${workspaceId}`

    socket.join(room)

    socket.workspaceId = workspaceId
    socket.userId = userId

    const users = addUser(workspaceId, userId)

    io.to(room).emit("workspaceUsers", users)
  })


  socket.on("sendMessage", ({ workspaceId, message, userId }) => {

    const room = `workspace:${workspaceId}`

    io.to(room).emit("receiveMessage", {
      userId,
      message,
      createdAt: new Date()
    })

  })


  socket.on("disconnect", () => {

    const { workspaceId, userId } = socket

    if (!workspaceId || !userId) return

    const room = `workspace:${workspaceId}`

    const users = removeUser(workspaceId, userId)

    io.to(room).emit("workspaceUsers", users)

  })

}