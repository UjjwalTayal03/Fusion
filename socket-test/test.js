import { io } from "socket.io-client"

const socket = io("http://localhost:5000")

socket.on("connect", () => {

  console.log("Connected:", socket.id)

  socket.emit("joinWorkspace", {
    workspaceId: "workspace123",
    userId: "userA"
  })

})

socket.on("workspaceUsers", (users) => {
  console.log("Online users:", users)
})