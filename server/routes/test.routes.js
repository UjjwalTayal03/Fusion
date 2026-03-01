import express from "express"
import protect from "../middleware/auth.middleware.js"
import asyncHandler from "../utils/asyncHandler.js"

const router  = express.Router()

router.get("/me", protect, asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}))

export default router