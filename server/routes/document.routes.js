import express from "express"
import protect from "../middleware/auth.middleware.js"
import checkPermission from "../middleware/permission.middleware.js"
import { createVersion, deleteDocument, getSingleDocument, getVersions, restoreVersion, updateDocument } from "../controllers/document.controller.js"
import checkDocumentPermission from "../middleware/documentPermission.middleware.js"

const router = express.Router()

router.get("/:docId", protect, getSingleDocument)
router.delete("/:docId", protect, checkDocumentPermission("canDeleteDoc"), deleteDocument)
router.put("/:docId/content", protect,checkDocumentPermission("canEdit") ,updateDocument)
router.post("/:docId/version", protect,checkDocumentPermission("canEdit"), createVersion)
router.get("/:docId/versions", protect, getVersions)
router.post("/restore/versionId", protect,checkDocumentPermission("canEdit"), restoreVersion)

export default router