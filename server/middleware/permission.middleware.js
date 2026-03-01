import Workspace from "../models/Workspace.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const checkPermission = (requiredPermission) => {
    return asyncHandler(async (req, res, next) => {
        const workspaceId = req.params.id

        if(!workspaceId)
            throw new ApiError(400, "Workspace ID is required")

        const workspace = await Workspace.findOne({
            _id: workspaceId,
            "members.user": req.user._id
        }).select("members")

        if(!workspace)
            throw new ApiError(404, "WorkSpace not found or access denied")

        const member = workspace.members.find(
            m => m.user.toString() === req.user._id.toString()
        )

        if(!member)
            throw new ApiError(403, "You are not member of this workspace")

        if(!member.permissions[requiredPermission])
            throw new ApiError(403, `You do not have ${requiredPermission} permission`)

        next()
    })
}

export default checkPermission