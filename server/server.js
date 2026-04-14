import dotenv from "dotenv"
dotenv.config()

import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"

import errorHandler from "./middleware/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import testRoutes from "./routes/test.routes.js"
import workspaceRoutes from "./routes/workspace.routes.js"
import documentRoutes from "./routes/document.routes.js"

import initSocket from "./sockets/index.js"
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"

// 🔌 Connect DB
connectDB()

const app = express()

// ✅ CORS for Express
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// 📦 Routes
app.use("/api/auth", authRoutes)
app.use("/api/test", testRoutes)
app.use("/api/workspace", workspaceRoutes)
app.use("/api/documents", documentRoutes)

// ❌ Error handler
app.use(errorHandler)

// 🌐 Create HTTP server
const server = http.createServer(app)

// 🔌 Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
})

// 🔥 Initialize sockets
initSocket(io)

// 🚀 Start server
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})