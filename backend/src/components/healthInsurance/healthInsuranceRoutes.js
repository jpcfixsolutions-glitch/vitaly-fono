import { Router } from "express";
import { healthInsuranceController } from "./healthInsuranceController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a", "Recepción"]), healthInsuranceController.getAllHealthInsurances);
router.get("/:id", auth, role(["Psicólogo/a", "Recepción"]), healthInsuranceController.getHealthInsuranceById);
router.post("/", auth, role(["Psicólogo/a"]), healthInsuranceController.createHealthInsurance);
router.patch("/:id", auth, role(["Psicólogo/a"]), healthInsuranceController.updateHealthInsurance);
router.delete("/:id", auth, role(["Psicólogo/a"]), healthInsuranceController.deactivateHealthInsurance);

export const healthInsuranceRoutes = router;