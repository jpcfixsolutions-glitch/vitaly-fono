import { Router } from "express";
import { fatherController } from "./fatherController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), fatherController.getAllFathers);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), fatherController.getFatherById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), fatherController.createFather);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), fatherController.updateFather);

export const fatherRoutes = router;
