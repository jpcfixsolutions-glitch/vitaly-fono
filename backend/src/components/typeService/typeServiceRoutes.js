import { Router } from "express";
import { typeServiceController } from "./typeServiceController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), typeServiceController.getAllTypeService);
router.get("/:id", auth, role(["Psicólogo/a"]), typeServiceController.getTypeServiceById);
router.post("/", auth, role(["Psicólogo/a"]), typeServiceController.createTypeService);
router.patch("/:id", auth, role(["Psicólogo/a"]), typeServiceController.updateTypeService);
router.delete("/:id", auth, role(["Psicólogo/a"]), typeServiceController.deactivateTypeService);

export const typeServiceRoutes = router;