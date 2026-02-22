import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError"
import asyncHandler from "../utils/asyncHandler"
import User from "../models/User"

const protect = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer "))
        throw new ApiError(401, "Not autorized")

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