import { Router } from "express";
import { motherController } from "./motherController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), motherController.getAllMothers);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), motherController.getMotherById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), motherController.createMother);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), motherController.updateMother);

export const motherRoutes = router;
