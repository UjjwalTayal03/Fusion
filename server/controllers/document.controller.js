import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Document from "../models/Document.js";
import Workspace from "../models/Workspace.js";

export const createDocument = asyncHandler(async (req, res) => {
    const {id} = req.params

    const workspace = await Workspace.findOne({
    _id: id,
    "members.user": req.user._id,
  });

    if (!workspace) {
        throw new ApiError(404, "Workspace not found or access denied");
    }

    const {title} = req.body

    if(!title)
        throw new ApiError(401, "Insufficient details")

    const document = await Document.create({
        title,
        workspace: workspace._id,
        createdBy: req.user._id,
        lastEditedBy: req.user._id
    })

    workspace.documents.push(document._id)
    await workspace.save()

    res.status(201).json({
        success: true,
        message: "Document created successfully",
        document
    })
})


export const getDocuments = asyncHandler(async (req, res) => {
    const {id} = req.params

    const workspace = await Workspace.findOne({
        _id: id,
        "members.user" : req.user._id
    })

    if(!workspace)
        throw new ApiError(404, "Workspace not found or access denied")

    const documents = await Document.find({
        _id : { $in: workspace.documents}
    })

    res.status(200).json({
        success: true,
        documents
    })
})

export const getSingleDocument = asyncHandler(async (req, res) => {
    const {docId} = req.params

    const document = await Document.findById(docId).populate('workspace')

    if(!document)
        throw new ApiError(404, "Document not found")

    if(!document.workspace.members.some(m => m.user.toString() === req.user._id.toString())){
        throw new ApiError(403, "Access denied to this document")
    }

    res.status(200).json({
        success: true,
        document
    })
})


export const deleteDocument = asyncHandler(async (req, res) => {
  await req.document.deleteOne();

  res.status(200).json({
    success: true,
    message: "Document deleted successfully",
  });
});