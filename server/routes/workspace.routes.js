import { createWorkspace, getWorkSpaces, getSingleWorkSpace, generateInvite, joinWorkspace } from "../controllers/workspace.controller.js";
import express from "express"
import protect from "../middleware/auth.middleware.js";
import checkPermission from "../middleware/permission.middleware.js";
import { createDocument, getDocuments } from "../controllers/document.controller.js";


const router = express.Router()

router.post("/", protect, createWorkspace)
router.get("/", protect, getWorkSpaces)
router.get("/:id",protect,  getSingleWorkSpace)
router.post("/:id/invite", protect, checkPermission("canInvite"), generateInvite)
router.post("/join/:token", protect, joinWorkspace)

//for docs

router.post("/:id/documents",protect, createDocument)
router.get("/:id/documents", protect, getDocuments)




export default router