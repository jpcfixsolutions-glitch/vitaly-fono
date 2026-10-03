import { Router } from "express";
import { calendarController } from "./calendarController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a", "Recepción"]), calendarController.getAllConfigurations);
router.get("/:id", auth, role(["Psicólogo/a", "Recepción"]), calendarController.getConfigurationById);
router.post("/", auth, role(["Psicólogo/a"]), calendarController.createConfiguration);
router.patch("/:id", auth, role(["Psicólogo/a"]), calendarController.updateConfiguration);
router.delete("/:id", auth, role(["Psicólogo/a"]), calendarController.deleteConfiguration);

export const calendarRoutes = router;