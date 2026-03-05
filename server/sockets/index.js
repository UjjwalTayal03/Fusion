import workspaceSocket from "./workspace.socket.js"
import documentSocket from "./document.socket.js"

export default function initSocket(io) {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id)

    workspaceSocket(io, socket)
    documentSocket(io, socket)
  })
}