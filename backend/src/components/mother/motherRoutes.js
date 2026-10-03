import { Router } from "express";
import { motherController } from "./motherController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), motherController.getAllMothers);
router.get("/:id", auth, role(["Psicólogo/a"]), motherController.getMotherById);
router.post("/", auth, role(["Psicólogo/a"]), motherController.createMother);
router.patch("/:id", auth, role(["Psicólogo/a"]), motherController.updateMother);

export const motherRoutes = router;