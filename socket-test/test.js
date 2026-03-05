import { io } from "socket.io-client"

const socket = io("http://localhost:5000")

socket.on("connect", () => {

  console.log("Connected:", socket.id)

  socket.emit("joinDocument", {
    documentId: "doc123"
  })

  setTimeout(() => {

    socket.emit("sendDelta", {
      documentId: "doc123",
      delta: { insert: "Hello world\n" }
    })

  }, 2000)

})

socket.on("receiveDelta", (delta) => {
  console.log("Received delta:", delta)
})