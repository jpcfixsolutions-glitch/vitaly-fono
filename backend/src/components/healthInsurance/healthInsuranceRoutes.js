import { Router } from "express";
import { healthInsuranceController } from "./healthInsuranceController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a", "Recepción"]), healthInsuranceController.getAllHealthInsurances);
router.get("/:id", auth, role(["Fonoaudiólogo/a", "Recepción"]), healthInsuranceController.getHealthInsuranceById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), healthInsuranceController.createHealthInsurance);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), healthInsuranceController.updateHealthInsurance);
router.delete("/:id", auth, role(["Fonoaudiólogo/a"]), healthInsuranceController.deactivateHealthInsurance);

export const healthInsuranceRoutes = router;
