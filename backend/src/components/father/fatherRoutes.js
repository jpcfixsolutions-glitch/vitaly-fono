import { Router } from "express";
import { fatherController } from "./fatherController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), fatherController.getAllFathers);
router.get("/:id", auth, role(["Psicólogo/a"]), fatherController.getFatherById);
router.post("/", auth, role(["Psicólogo/a"]), fatherController.createFather);
router.patch("/:id", auth, role(["Psicólogo/a"]), fatherController.updateFather);

export const fatherRoutes = router;