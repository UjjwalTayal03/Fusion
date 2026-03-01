import dotenv from "dotenv"
dotenv.config()
import express from "express"
import errorHandler from "./middleware/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import testRoutes from "./routes/test.routes.js"
import workspaceRoutes from "./routes/workspace.routes.js"
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"


connectDB()


const app = express()
app.use(express.json())
app.use(cookieParser())



app.use("/api/auth", authRoutes)
app.use("/api/test", testRoutes)
app.use("/api/workspace", workspaceRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`App running on http://localhost:${PORT}`)
})