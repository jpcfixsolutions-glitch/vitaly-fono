import { Router } from "express";
import { sessionController } from "./sessionController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

import { upload } from "../../middlewares/upload.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), sessionController.getAllSessions);
router.get("/:id", auth, role(["Psicólogo/a"]), sessionController.getSessionById);
router.post("/", auth, role(["Psicólogo/a"]), sessionController.createSession);
router.patch("/:id", auth, role(["Psicólogo/a"]), sessionController.updateSession);
router.post("/:id/files", auth, role(["Psicólogo/a"]), upload.single('file'), sessionController.uploadFile);
router.get("/:id/files", auth, role(["Psicólogo/a"]), sessionController.getFilesBySession);
router.delete("/files/:fileId", auth, role(["Psicólogo/a"]), sessionController.deleteFile);

export const sessionRoutes = router;
