import { Router } from "express";
import { roleController } from "./roleController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Administrador"]), roleController.getAllRoles);
router.get("/:id", auth, role(["Administrador"]), roleController.getRoleById);
router.post("/", auth, role(["Administrador"]), roleController.createRole);
router.patch("/:id", auth, role(["Administrador"]), roleController.updateRole);
router.delete("/:id", auth, role(["Administrador"]), roleController.deleteRole);

export const roleRoutes = router;