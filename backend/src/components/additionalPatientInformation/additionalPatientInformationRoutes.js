import { Router } from "express";
import { additionalPatientInformationController } from "./additionalPatientInformationController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), additionalPatientInformationController.getAllAdditionalPatientInformation);
router.get("/:id", auth, role(["Psicólogo/a"]), additionalPatientInformationController.getAdditionalPatientInformationById);
router.post("/", auth, role(["Psicólogo/a"]), additionalPatientInformationController.createAdditionalPatientInformation);
router.patch("/:id", auth, role(["Psicólogo/a"]), additionalPatientInformationController.updateAdditionalPatientInformation);

export const additionalPatientInformationRoutes = router;