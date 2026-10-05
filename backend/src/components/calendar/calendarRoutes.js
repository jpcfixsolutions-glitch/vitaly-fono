import { Router } from "express";
import { calendarController } from "./calendarController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a", "Recepción"]), calendarController.getAllConfigurations);
router.get("/:id", auth, role(["Fonoaudiólogo/a", "Recepción"]), calendarController.getConfigurationById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), calendarController.createConfiguration);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), calendarController.updateConfiguration);
router.delete("/:id", auth, role(["Fonoaudiólogo/a"]), calendarController.deleteConfiguration);

export const calendarRoutes = router;
