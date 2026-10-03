import { Router } from "express";
import { documentTypeController } from "./documentTypeController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a", "Recepción"]), documentTypeController.getAllDocumentTypes);
router.post("/", auth, role(["Psicólogo/a"]), documentTypeController.createDocumentType);

export const documentTypeRoutes = router;