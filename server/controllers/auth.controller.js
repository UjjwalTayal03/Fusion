import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt"
import asyncHandler from "../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import Workspace from "../models/Workspace.js";

export const register = asyncHandler(async (req ,res) => {
    let {name, email, password} = req.body

    if(!name || !email || !password){
        throw new ApiError(400 , "Insufficient Details")
    }

    email = email.toLowerCase().trim()

    const existing = await User.findOne({email})

    if(existing)
        throw new ApiError(400, "User with this email already exists")


    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
        name,
        email,
        password: hashed
    })

    res.status(201).json({success: true, user})
})


export const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(400, "Insufficient credentials")
    }

    const user = await User.findOne({email}).select("+password")

    if(!user)
        throw new ApiError(404, "User doesn't exist")

    const compared = await bcrypt.compare(password, user.password)

    if(!compared){
        throw new ApiError(400, "Invalid credentials")
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    user.refreshToken = refreshToken
    await user.save()

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: true
    })

    res.status(200).json({
        success: true,
        accessToken, 
        user
    })


})

export const refresh = asyncHandler(async (req, res) => {

    const token = req.cookies.refreshToken

    if(!token)
        throw new ApiError(404, "Refresh token not found")

    let decoded

    try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        throw new ApiError(401, "Invalid or expired refresh token")
    }

    const user = await User.findById(decoded.id)

    if(!user)
        throw new ApiError(404, "user not found")

    if(user.refreshToken !== token)
        throw new ApiError(401, "refresh token mismatch")

    const newAccessToken = generateAccessToken(user._id)

    res.status(200).json({
        success: true,
        accessToken: newAccessToken
    })
})


export const logout = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(!user)
        throw new ApiError(404, "no user found")

    user.refreshToken = null

    await user.save()

    res.clearCookie("refreshToken")

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})


