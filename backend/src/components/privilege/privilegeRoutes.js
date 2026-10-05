import { Router } from "express";
import { privilegeController } from "./privilegeController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Administrador"]), privilegeController.getAllPrivileges);
router.get("/:id", auth, role(["Administrador"]), privilegeController.getPrivilegeById);
router.post("/", auth, role(["Administrador"]), privilegeController.createPrivilege);
router.patch("/:id", auth, role(["Administrador"]), privilegeController.updatePrivilege);
router.delete("/:id", auth, role(["Administrador"]), privilegeController.deletePrivilege);

export const privilegeRoutes = router;
