import workspaceSocket from "./workspace.socket.js"
import documentSocket from "./document.socket.js"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

export default function initSocket(io) {

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token

      if (!token) return next(new Error("Authentication error"))

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

      const user = await User.findById(decoded.id)

      if (!user) return next(new Error("User not found"))

      socket.user = user

      next()

    } catch (err) {
      next(new Error("Authentication failed"))
    }
  })

  io.on("connection", (socket) => {

    console.log("User connected:", socket.user._id)

    workspaceSocket(io, socket)
    documentSocket(io, socket)

  })
}