import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Document from "../models/Document.js";
import Workspace from "../models/Workspace.js";

const checkDocumentPermission = (requiredPermission) => 
    asyncHandler(async (req , res, next) => {
        const {docId} = req.params

        if (!docId) {
      throw new ApiError(400, "Document ID is required");
    }

    const document = await Document.findById(docId);
if (!document) {
      throw new ApiError(404, "Document not found");
    }

    const workspace = await Workspace.findById(document.workspace);
if (!workspace) {
      throw new ApiError(404, "Workspace not found");
    }
if (workspace.owner.toString() === req.user._id.toString()) {
      req.document = document;
      req.workspace = workspace;
      return next();
    }
const member = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
if (!member) {
      throw new ApiError(403, "Access denied");
    }

    if (!member.permissions[requiredPermission]) {
      throw new ApiError(403, "Insufficient permission");
    }
req.document = document;
    req.workspace = workspace;

    next();

    })


export default checkDocumentPermission