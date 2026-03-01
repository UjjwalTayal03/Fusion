import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import User from "../models/User.js"

const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer "))
        throw new ApiError(401, "Not authorized")

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decoded.id).select("-password -refreshToken")

        if(!user)
            throw new ApiError("401", "User not found")

        req.user = user

        next()
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token");

    }
})

export default protect