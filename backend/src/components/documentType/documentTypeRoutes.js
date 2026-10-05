import { Router } from "express";
import { documentTypeController } from "./documentTypeController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a", "Recepción"]), documentTypeController.getAllDocumentTypes);
router.post("/", auth, role(["Fonoaudiólogo/a"]), documentTypeController.createDocumentType);
router.delete("/:id", auth, role(["Fonoaudiólogo/a"]), documentTypeController.deactivateDocumentType);

export const documentTypeRoutes = router;
