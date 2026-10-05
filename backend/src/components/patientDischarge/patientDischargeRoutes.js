import { Router } from "express";
import { patientDischargeController } from "./patientDischargeController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), patientDischargeController.getAllPatientDischarges);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), patientDischargeController.getPatientDischargeById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), patientDischargeController.createPatientDischarge);

export const patientDischargeRoutes = router;
