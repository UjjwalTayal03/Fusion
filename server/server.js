import dotenv from "dotenv"
dotenv.config()

import express from "express"
import http from "http"
import { Server } from "socket.io"

import errorHandler from "./middleware/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import testRoutes from "./routes/test.routes.js"
import workspaceRoutes from "./routes/workspace.routes.js"
import documentRoutes from "./routes/document.routes.js"

import initSocket from "./sockets/index.js"

import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"


connectDB()


const app = express()
app.use(express.json())
app.use(cookieParser())



app.use("/api/auth", authRoutes)
app.use("/api/test", testRoutes)
app.use("/api/workspace", workspaceRoutes)
app.use("/api/documents", documentRoutes)

app.use(errorHandler)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})

initSocket(io)

const PORT = process.env.PORT || 5000

server.listen(PORT, ()=>{
    console.log(`App running on http://localhost:${PORT}`)
})