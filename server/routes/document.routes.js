import express from "express"
import protect from "../middleware/auth.middleware.js"
import checkPermission from "../middleware/permission.middleware.js"
import { deleteDocument, getSingleDocument } from "../controllers/document.controller.js"
import checkDocumentPermission from "../middleware/documentPermission.middleware.js"

const router = express.Router()

router.get("/:docId", protect, getSingleDocument)
router.delete("/:docId", protect, checkDocumentPermission("canDeleteDoc"), deleteDocument)


export default router