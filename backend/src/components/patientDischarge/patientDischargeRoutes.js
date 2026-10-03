import { Router } from "express";
import { patientDischargeController } from "./patientDischargeController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), patientDischargeController.getAllPatientDischarges);
router.get("/:id", auth, role(["Psicólogo/a"]), patientDischargeController.getPatientDischargeById);
router.post("/", auth, role(["Psicólogo/a"]), patientDischargeController.createPatientDischarge);

export const patientDischargeRoutes = router;