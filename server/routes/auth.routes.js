import express from "express"
import { login, logout, refresh, register } from "../controllers/auth.controller"
import protect from "../middleware/auth.middleware"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", refresh)
router.post("/logout", protect, logout)

export default router