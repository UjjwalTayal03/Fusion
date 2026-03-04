import jwt from "jsonwebtoken"
import User from "../models/User.js"

export default function initSocket(io){

    const workspaceUsers = new Map()

    io.on("connection", (socket) => {
        console.log("User connected: ", socket.id)

        socket.on("joinWorkspace", ({workspaceId, userId}) => {

            const room = `workspace:${workspaceId}`

            socket.join(room)

            socket.userId = userId
            socket.workspaceId = workspaceId

            if(!workspaceUsers.has(workspaceId)){
                workspaceUsers.set(workspaceId, new Set())
            }

            workspaceUsers.get(workspaceId).add(userId)

            const users = Array.from(workspaceUsers.get(workspaceId))

            io.to(room).emit("workspaceUsers", users)

            console.log(`User ${userId} joined ${room}`)
        })

        socket.on("disconnect", () => {
            const {workspaceId, userId} = socket

            if(!workspaceId || !userId)return

            const room = `workspace:${workspaceId}`

            const users = workspaceUsers.get(workspaceId)

            if(users){
                users.delete(userId)

            if (users.size === 0) {
                workspaceUsers.delete(workspaceId)
            }

            io.to(room).emit("workspaceUsers", Array.from(users))
            }
            console.log(`User ${userId} left workspace ${workspaceId}`)
        })
    })
}