import { Router } from "express";
import { typeServiceController } from "./typeServiceController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), typeServiceController.getAllTypeService);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), typeServiceController.getTypeServiceById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), typeServiceController.createTypeService);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), typeServiceController.updateTypeService);
router.delete("/:id", auth, role(["Fonoaudiólogo/a"]), typeServiceController.deactivateTypeService);

export const typeServiceRoutes = router;
