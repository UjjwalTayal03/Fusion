import dotenv from "dotenv"
dotenv.config()
import express from "express"
import errorHandler from "./middleware/error.middleware"
import authRoutes from "./routes/auth.routes"


const app = express()



app.use("/api/auth", authRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`App running on http://localhost:${PORT}`)
})