import { Router } from "express";
import { archiveAttachmentController } from "./archiveAttachmentController.js";
import { auth } from "../../middlewares/auth.js";
import { upload } from "../../middlewares/upload.js";

const router = Router();

router.post("/:id/upload", auth, upload.single('file'), archiveAttachmentController.uploadFile);
router.delete("/:fileId", auth, archiveAttachmentController.deleteFile);

export const archiveAttachmentRoutes = router;

