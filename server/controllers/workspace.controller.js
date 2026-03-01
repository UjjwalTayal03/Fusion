import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Workspace from "../models/Workspace.js";
import crypto from "crypto";

export const createWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Insufficient details");
  }

  const workspace = await Workspace.create({
    name,
    description,
    owner: req.user._id,
    members: [
      {
        user: req.user._id,
        permissions: {
          canEdit: true,
          canInvite: true,
          canDeleteDoc: true,
          canManageMembers: true,
        },
      },
    ],
  });

  res.status(201).json(workspace);
});

export const getWorkSpaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({
    "members.user": req.user._id,
  }).select("_id name description members");

  const result = workspaces.map((ws) => {
    const currentMember = ws.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    return {
      _id: ws._id,
      name: ws.name,
      description: ws.description,
      permissions: currentMember.permissions,
    };
  });

  res.status(200).json(result);
});

export const getSingleWorkSpace = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const workspace = await Workspace.findOne({
    _id: id,
    "members.user": req.user._id,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found or access denied");
  }

  res.status(200).json(workspace);
});

export const generateInvite = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const workspace = await Workspace.findById(id);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (
    workspace.inviteToken &&
    workspace.inviteExpiresAt &&
    workspace.inviteExpiresAt > new Date()
  ) {
    return res.status(200).json({
      message: "Active invite already exists",
      inviteLink: `${process.env.CLIENT_URL}/join/${workspace.inviteToken}`,
      expiresAt: workspace.inviteExpiresAt
    });
  }

  const token = crypto.randomBytes(32).toString("hex");

  workspace.inviteToken = token;
  workspace.inviteExpiresAt = new Date(
    Date.now() + 48 * 60 * 60 * 1000
  );

  await workspace.save();

  res.status(200).json({
    message: "Invite generated",
    inviteLink: `${process.env.CLIENT_URL}/join/${token}`,
    expiresAt: workspace.inviteExpiresAt
  });
});

export const joinWorkspace = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const workspace = await Workspace.findOne({ inviteToken: token });

  if (!workspace) throw new ApiError(404, "Invalid invite token");

  if (!workspace.inviteExpiresAt || workspace.inviteExpiresAt < Date.now())
    throw new ApiError(400, "Invite link has expired");

  const alreadyMember = workspace.members.some(
    (m) => m.user.toString() === req.user._id.toString(),
  );

  if (alreadyMember)
    throw new ApiError(400, "You are already a member of this workspace");

  workspace.members.push({
    user: req.user._id,
    permissions: {
      canEdit: true,
      canInvite: false,
      canDeleteDoc: false,
      canManageMembers: false,
    },
  });

  await workspace.save();

  res.status(200).json({
    message: "Successfully Joined workspace",
    workspaceId: workspace._id,
  });
});
