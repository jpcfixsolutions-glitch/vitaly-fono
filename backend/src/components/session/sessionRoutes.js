import { Router } from "express";
import { sessionController } from "./sessionController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

import { upload } from "../../middlewares/upload.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), sessionController.getAllSessions);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), sessionController.getSessionById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), sessionController.createSession);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), sessionController.updateSession);
router.post("/:id/files", auth, role(["Fonoaudiólogo/a"]), upload.single('file'), sessionController.uploadFile);
router.get("/:id/files", auth, role(["Fonoaudiólogo/a"]), sessionController.getFilesBySession);
router.delete("/files/:fileId", auth, role(["Fonoaudiólogo/a"]), sessionController.deleteFile);

export const sessionRoutes = router;
